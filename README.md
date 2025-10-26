# GitHub Issue Cost Estimator

An AI-powered tool that analyzes GitHub repository issues and provides cost estimates based on complexity. Built with Next.js, Claude AI, and the GitHub API.

## Live Demo

🚀 **Hosted URL**: [Your Vercel URL will appear here after deployment]

## Features

- **Simple Web Interface**: Enter any GitHub repository URL and get instant analysis
- **AI-Powered Analysis**: Uses Claude AI to analyze issue complexity based on:
  - Technical complexity from descriptions
  - Number of acceptance criteria
  - Bug fix vs feature distinction
  - Detailed specs vs vague requirements
  - Labels and comments
- **Complexity Levels**:
  - **Low** ($100-$300): Bug fixes and minor changes
  - **Medium** ($300-$600): Moderate features
  - **High** ($600-$1,000): Complex features and major enhancements
- **CSV Export**: Download detailed cost estimates for all open issues
- **Rate Limit Handling**: Gracefully handles GitHub and Anthropic API rate limits

## Prerequisites

- Node.js 18.0.0 or higher
- GitHub Personal Access Token
- Anthropic API Key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd nsissueestimator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
GITHUB_TOKEN=ghp_your_github_token_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key_here
```

#### Getting API Keys

**GitHub Token:**
1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `public_repo` (for public repositories only)
   - `repo` (if you need access to private repositories)
4. Copy the generated token

**Anthropic API Key:**
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables when asked

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `GITHUB_TOKEN`
   - `ANTHROPIC_API_KEY`
6. Click "Deploy"

### Important: Serverless Function Timeout

By default, Vercel Hobby plan has a 10-second timeout for serverless functions. If you're analyzing repositories with many issues, you may need:

- **Vercel Pro Plan**: Supports up to 5-minute timeouts (configured in `pages/api/analyze.js`)
- **Alternative**: Process issues in batches or implement a queue system

## Usage

1. Enter a GitHub repository URL (e.g., `https://github.com/vercel/next.js`)
2. Click "Analyze Repository"
3. Wait for the analysis to complete (this may take a few minutes for repos with many issues)
4. A CSV file will automatically download with the results
5. View the summary statistics on the page

## CSV Output Format

The exported CSV contains the following columns:

| Column | Description |
|--------|-------------|
| issue_number | GitHub issue number |
| title | Issue title |
| complexity | low, medium, or high |
| estimated_cost | Dollar amount ($100-$1000) |
| labels | Semicolon-separated list of labels |
| url | Direct link to the GitHub issue |

## Error Handling

The tool handles various error scenarios:

- **Invalid GitHub URL**: Validates URL format
- **Private Repository**: Requires appropriate GitHub token permissions
- **Repository Not Found**: Returns 404 error
- **API Rate Limits**: Includes delays between API calls and error messages
- **Network Errors**: Displays user-friendly error messages

## Architecture

```
├── pages/
│   ├── index.js           # Frontend UI with form and results
│   └── api/
│       └── analyze.js     # API endpoint for GitHub/AI analysis
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variable template
└── README.md             # This file
```

## Technologies Used

- **Next.js**: React framework with API routes
- **Tailwind CSS**: Styling (via CDN)
- **@octokit/rest**: GitHub API client
- **@anthropic-ai/sdk**: Claude AI integration
- **Vercel**: Hosting and serverless functions

## Cost Estimation Logic

The AI analyzes each issue considering:

1. **Technical Complexity**: Keywords and technical depth in descriptions
2. **Scope Indicators**: Number of requirements and acceptance criteria
3. **Issue Type**: Bug fix (lower cost) vs feature (higher cost)
4. **Specification Quality**: Detailed specs vs vague requirements
5. **Labels**: GitHub labels indicating scope and complexity

## Limitations

- Only analyzes open issues (closed issues are excluded)
- Pull requests are filtered out
- AI estimates are approximate and should be validated
- Large repositories may take several minutes to process
- Requires valid API keys with sufficient rate limits

## Contributing

Feel free to submit issues and pull requests!

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact the maintainer.
