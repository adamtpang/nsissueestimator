# Quick Start Guide

Get your GitHub Issue Cost Estimator running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Get API Keys (2 mins)

### GitHub Token
1. Visit: https://github.com/settings/tokens/new
2. Name: "Issue Cost Estimator"
3. Select scope: `public_repo`
4. Click "Generate token"
5. Copy the token (starts with `ghp_`)

### Anthropic API Key
1. Visit: https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copy the key (starts with `sk-ant-`)

## Step 3: Configure Environment (30 seconds)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
GITHUB_TOKEN=ghp_your_token_here
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

## Step 4: Run! (30 seconds)

```bash
npm run dev
```

Open: http://localhost:3000

## Step 5: Test It Out

Try analyzing a popular repo:
```
https://github.com/vercel/next.js
```

(Note: Large repos may take a few minutes)

## Deploy to Vercel (30 seconds)

```bash
npx vercel
```

Follow the prompts and add your environment variables when asked.

## That's It!

You now have a working GitHub Issue Cost Estimator.

For detailed documentation, see:
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## Common Issues

**"Cannot find module..."**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Environment variable not found"**
- Make sure `.env.local` exists
- Restart the dev server after creating it

**"Repository not found"**
- Check if repo is public
- Verify GitHub token has correct permissions

## Example Output

The tool will generate a CSV like:

```csv
issue_number,title,complexity,estimated_cost,labels,url
1234,"Add dark mode",high,$800,"enhancement; ui","https://github.com/..."
1235,"Fix login bug",low,$200,"bug; critical","https://github.com/..."
```

## Need Help?

Check the full [README.md](./README.md) for troubleshooting and advanced configuration.
