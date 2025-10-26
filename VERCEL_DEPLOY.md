# Vercel Deployment Guide

## Why It Wasn't Deploying

The `vercel.json` had incorrect environment variable syntax. This has been fixed! ✅

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

This is the easiest method for first-time deployment.

#### Step 1: Push to GitHub
```bash
git push origin master
```

#### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `adamtpang/nsissueestimator`
4. Vercel will auto-detect it's a Next.js project ✓

#### Step 3: Configure Environment Variables
Before clicking "Deploy", add these environment variables:

| Name | Value |
|------|-------|
| `GITHUB_TOKEN` | Copy from your `.env.local` file |
| `ANTHROPIC_API_KEY` | Copy from your `.env.local` file |

**How to add them:**
1. Click "Environment Variables" section
2. Enter name: `GITHUB_TOKEN`
3. Enter value: (paste your token from `.env.local`)
4. Select all environments: Production, Preview, Development
5. Click "Add"
6. Repeat for `ANTHROPIC_API_KEY`

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for build to complete
3. You'll get a URL like: `https://nsissueestimator.vercel.app`

---

### Method 2: Deploy via Vercel CLI

If you prefer command line:

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **Project name?** Press Enter (default: nsissueestimator)
- **Directory?** Press Enter (current directory)
- **Override settings?** No

#### Step 4: Add Environment Variables
After first deployment, add environment variables:

```bash
# Add GitHub token
vercel env add GITHUB_TOKEN

# When prompted:
# - Environment: Production
# - Value: Paste your GitHub token from .env.local

# Add Anthropic API key
vercel env add ANTHROPIC_API_KEY

# When prompted:
# - Environment: Production
# - Value: Paste your Anthropic API key from .env.local
```

#### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

---

## Verifying Your Deployment

### 1. Check Build Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the latest deployment
- Check "Building" and "Deployment" logs
- Should see: ✓ Compiled successfully

### 2. Test the Live Application
1. Open your Vercel URL (e.g., `https://nsissueestimator.vercel.app`)
2. You should see the GitHub Issue Cost Estimator interface
3. Try entering a test repo: `https://github.com/anthropics/anthropic-quickstarts`
4. Click "Analyze Repository"
5. Wait for processing (may take 10-30 seconds)
6. CSV should auto-download
7. Summary statistics should display

### 3. Test Error Handling
Try entering an invalid URL like `https://example.com` - should show an error message.

---

## Common Deployment Issues

### Issue: "Module not found" errors
**Solution:** Make sure all dependencies are in `package.json`
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: Environment variables not working
**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Make sure both `GITHUB_TOKEN` and `ANTHROPIC_API_KEY` are added
3. Make sure they're enabled for Production environment
4. Redeploy the project

### Issue: Function timeout on large repos
**Solution:**
- The free Hobby plan has a 10-second timeout
- Upgrade to Pro plan ($20/month) for 5-minute timeout
- Or test with smaller repositories (< 20 issues)

### Issue: Build fails with "ENOENT" error
**Solution:** Make sure all required files are committed:
```bash
git status
git add .
git commit -m "Add missing files"
git push
```

---

## Post-Deployment Checklist

- [ ] Deployment successful in Vercel dashboard
- [ ] No build errors in logs
- [ ] URL is accessible
- [ ] Frontend UI loads correctly
- [ ] Can enter GitHub repository URL
- [ ] Test with small repo (< 10 issues) completes successfully
- [ ] CSV downloads correctly
- [ ] Summary statistics display
- [ ] Environment variables configured
- [ ] Added hosted URL to README.md

---

## Update README with Hosted URL

After successful deployment, update your README:

```bash
# Open README.md and update the "Live Demo" section with your actual URL
```

Example:
```markdown
## Live Demo

🚀 **Hosted URL**: https://nsissueestimator.vercel.app
```

Then commit and push:
```bash
git add README.md
git commit -m "Add hosted URL to README"
git push
```

---

## Monitoring Your Deployment

### Check Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click "Logs" or "Functions"
3. You can see real-time logs of API calls
4. Useful for debugging issues

### Monitor API Usage
1. **Anthropic API**: https://console.anthropic.com/
   - Check usage and costs
2. **GitHub API**: Check rate limits
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit
   ```

---

## Custom Domain (Optional)

Want to use your own domain?

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `issues.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

---

## Continuous Deployment

Good news! Vercel automatically redeploys when you push to GitHub.

Every time you run:
```bash
git push origin master
```

Vercel will:
1. Detect the push
2. Build your project
3. Run tests
4. Deploy automatically
5. Send you a notification

---

## Rollback (If Needed)

If a deployment breaks something:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Find a previous working deployment
3. Click the three dots (⋮)
4. Click "Promote to Production"

---

## Next Steps

1. **Test thoroughly** with various repositories
2. **Monitor costs** on Anthropic Console
3. **Share the URL** with your team
4. **Gather feedback** and iterate
5. **Consider upgrading** to Pro if you need longer timeouts

---

## Support

If you encounter issues:
1. Check Vercel Dashboard logs
2. Review `TROUBLESHOOTING.md`
3. Check Vercel documentation: https://vercel.com/docs
4. Vercel support: https://vercel.com/support

---

**Your Next.js app is ready for Vercel!** 🚀

The issue was in the `vercel.json` configuration, which has been fixed. You should now be able to deploy successfully using either method above.
