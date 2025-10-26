# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### Problem: `npm install` fails
```
Error: Cannot find module 'xyz'
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Node version too old
```
Error: The engine "node" is incompatible
```

**Solution:**
```bash
# Check your Node version
node --version

# Should be >= 18.0.0
# Install latest LTS: https://nodejs.org/
```

## Environment Variable Issues

### Problem: "GitHub token not configured"

**Solutions:**
1. Create `.env.local` file in project root
2. Add: `GITHUB_TOKEN=ghp_your_token`
3. Restart dev server: `npm run dev`

### Problem: "Anthropic API key not configured"

**Solutions:**
1. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-your_key`
2. Restart dev server

### Problem: Environment variables not working on Vercel

**Solutions:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add both `GITHUB_TOKEN` and `ANTHROPIC_API_KEY`
3. Make sure to add for **all environments** (Production, Preview, Development)
4. Redeploy the project

## GitHub API Issues

### Problem: "Repository not found"

**Possible Causes:**
- Repository is private and token lacks permissions
- Repository doesn't exist
- URL format is incorrect

**Solutions:**
```bash
# Correct URL format:
✓ https://github.com/owner/repo
✗ github.com/owner/repo
✗ https://github.com/owner/repo/issues
```

**For private repos:**
1. Go to https://github.com/settings/tokens
2. Edit your token
3. Add `repo` scope (not just `public_repo`)

### Problem: "GitHub API rate limit exceeded"

**Details:**
- Authenticated: 5,000 requests/hour
- Unauthenticated: 60 requests/hour

**Solutions:**
1. Wait for rate limit to reset (check headers)
2. Use authenticated token (not unauthenticated)
3. Reduce number of issues analyzed
4. Try again in 1 hour

**Check your rate limit:**
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

## Claude API Issues

### Problem: "Anthropic API error"

**Common Causes:**
- Invalid API key
- Insufficient credits
- Rate limit exceeded

**Solutions:**
1. Verify key at https://console.anthropic.com/settings/keys
2. Check account credits/billing
3. Check API status: https://status.anthropic.com/

### Problem: AI responses not parsing correctly

**Symptom:**
```
Warning: Failed to parse Claude response, using default complexity
```

**This is expected:**
- The system has fallback heuristics
- Analysis will continue with simple logic
- Check API logs for specific error

## Deployment Issues

### Problem: Vercel deployment fails

**Solution 1: Build errors**
```bash
# Test build locally first
npm run build

# Fix any errors shown
# Then push to GitHub
```

**Solution 2: Missing dependencies**
```bash
# Make sure package.json is committed
git add package.json
git commit -m "Add package.json"
git push
```

### Problem: "Function execution timeout"

**Cause:**
- Repository has too many issues
- Vercel Hobby plan has 10s timeout

**Solutions:**

**Option 1: Upgrade to Vercel Pro**
- Pro plan supports 300s (5 min) timeout
- Configured in `pages/api/analyze.js`

**Option 2: Test with smaller repos**
- Try repos with < 50 open issues first

**Option 3: Modify timeout** (requires Pro)
```javascript
// pages/api/analyze.js
export const config = {
  maxDuration: 300 // Already configured
};
```

## Runtime Issues

### Problem: "CSV download not working"

**Browser-specific solutions:**

**Chrome/Edge:**
- Check download settings
- Allow pop-ups from localhost
- Check browser console for errors

**Firefox:**
- Same as above

**Safari:**
- May need to explicitly allow downloads

### Problem: Loading never completes

**Check browser console (F12):**

**Common errors:**
```javascript
// Network error
Failed to fetch → Check API is running

// CORS error
Access-Control-Allow-Origin → Should not happen on same domain

// Timeout
Request timeout → Repository too large or API slow
```

**Solutions:**
1. Check backend logs
2. Try smaller repository
3. Check API keys are valid

### Problem: Analysis returns empty CSV

**Cause:** No open issues in repository

**Verify:**
```bash
# Check repo has open issues
# Visit: https://github.com/owner/repo/issues
```

**Note:** Pull requests are filtered out automatically.

## Data Quality Issues

### Problem: Cost estimates seem wrong

**Expected behavior:**
- AI analysis is approximate
- Estimates should be validated
- Costs are based on general ranges

**Factors affecting accuracy:**
- Issue description quality
- Label accuracy
- Comments providing context

**Improve accuracy:**
1. Ensure issues have detailed descriptions
2. Use consistent labels (bug, feature, enhancement)
3. Add acceptance criteria in issue body

### Problem: Wrong complexity assigned

**Example:**
```
Simple bug marked as "high" complexity
```

**Causes:**
- Vague issue description
- AI interpretation differs from human
- Fallback heuristics used

**Solutions:**
1. Review and manually adjust CSV
2. Improve issue descriptions
3. Add more context in issue body

## API Key Issues

### Problem: GitHub token invalid

**Verify token:**
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user
```

**Should return your GitHub user info**

**If invalid:**
1. Generate new token: https://github.com/settings/tokens/new
2. Required scopes: `public_repo` or `repo`
3. Update `.env.local` or Vercel environment variables

### Problem: Anthropic key invalid

**Verify key:**
1. Log into https://console.anthropic.com/
2. Go to Settings → API Keys
3. Check if key exists and is active
4. Generate new key if needed

**Key format:**
- Should start with `sk-ant-`
- Case-sensitive

## Performance Issues

### Problem: Analysis is very slow

**Expected times:**
- 10 issues: ~10 seconds
- 50 issues: ~30 seconds
- 100 issues: ~1 minute
- 500 issues: ~5 minutes

**Bottlenecks:**
1. GitHub API calls
2. Claude API calls (500ms delay between)
3. Network latency

**No current solution** (by design to respect rate limits)

### Problem: High API costs

**Claude API pricing:**
- ~$0.003 per issue analyzed
- 100 issues ≈ $0.30

**Reduce costs:**
1. Filter issues before analysis
2. Analyze only specific labels
3. Use caching (future feature)

## Debug Mode

### Enable verbose logging

**Local development:**
```javascript
// pages/api/analyze.js
// Logs are already included:
console.log(`Fetching issues for ${owner}/${repo}...`);
console.log(`Analyzing issue ${i + 1}/${allIssues.length}`);
```

**View logs:**
```bash
# Terminal where `npm run dev` is running
# OR Vercel Dashboard → Functions → Logs
```

## Getting Help

### Before asking for help:

1. **Check browser console (F12)**
   - Look for red errors
   - Copy full error message

2. **Check API logs**
   - Local: Terminal output
   - Vercel: Dashboard → Functions → Logs

3. **Verify environment variables**
   ```bash
   cat .env.local  # Should show your keys
   ```

4. **Test with a known working repo**
   ```
   https://github.com/vercel/next.js
   (Warning: has many issues, may take time)
   ```

### Report Issues

Open a GitHub issue with:
- Error message (full text)
- Steps to reproduce
- Browser and Node versions
- Repository URL being analyzed (if public)

## Quick Diagnostic Checklist

- [ ] Node.js version >= 18.0.0
- [ ] `npm install` completed successfully
- [ ] `.env.local` file exists
- [ ] `GITHUB_TOKEN` is set and valid
- [ ] `ANTHROPIC_API_KEY` is set and valid
- [ ] Dev server running (`npm run dev`)
- [ ] No errors in browser console
- [ ] GitHub repository URL is correct format
- [ ] Repository has open issues

If all checked and still not working, check the logs for specific errors.
