# Deployment Guide

## Quick Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- GitHub Personal Access Token
- Anthropic API Key

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GitHub Issue Cost Estimator"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel dashboard, go to Settings > Environment Variables and add:

   | Name | Value |
   |------|-------|
   | `GITHUB_TOKEN` | Your GitHub token (ghp_...) |
   | `ANTHROPIC_API_KEY` | Your Anthropic key (sk-ant-...) |

   Make sure to add them for **Production**, **Preview**, and **Development** environments.

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Important Notes

#### Function Timeout
- **Hobby Plan**: 10-second timeout (may not work for large repos)
- **Pro Plan**: 300-second (5-minute) timeout (recommended for production)
- The code is configured for 300 seconds in `pages/api/analyze.js`

#### Cost Considerations
- **GitHub API**: 5,000 requests/hour for authenticated requests
- **Anthropic API**: Pay-per-use, ~$0.003 per request for Sonnet
- Example: Analyzing 100 issues ≈ $0.30 in Claude API costs

### Testing Locally Before Deploy

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Open http://localhost:3000
```

### Troubleshooting

**"GitHub token not configured" error**
- Ensure environment variables are set in Vercel dashboard
- Redeploy after adding variables

**"Function timeout" error**
- Upgrade to Vercel Pro plan for longer timeouts
- Or reduce the number of issues analyzed per request

**"API rate limit exceeded"**
- Wait for rate limit to reset (usually 1 hour)
- Use a GitHub token with higher rate limits
- Add delay between requests (already implemented)

### Monitoring

After deployment, monitor:
- Vercel Function Logs (in dashboard)
- API usage in Anthropic Console
- GitHub API rate limits

### Custom Domain (Optional)

1. Go to Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Updates

To update the deployed app:
```bash
git add .
git commit -m "Update description"
git push
```

Vercel will automatically redeploy on push to main branch.
