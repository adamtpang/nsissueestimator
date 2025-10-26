import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';

// Cost ranges
const COST_RANGES = {
  low: { min: 100, max: 300 },
  medium: { min: 300, max: 600 },
  high: { min: 600, max: 1000 }
};

// Helper function to parse GitHub URL
function parseGitHubUrl(url) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error('Invalid GitHub URL format. Expected: https://github.com/owner/repo');
  }
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

// Helper function to analyze issue with Claude
async function analyzeIssueWithClaude(issue, anthropic) {
  const prompt = `Analyze this GitHub issue and estimate its complexity and cost.

Issue Title: ${issue.title}
Issue Body: ${issue.body || 'No description provided'}
Labels: ${issue.labels.map(l => l.name).join(', ') || 'None'}
Comments Count: ${issue.comments}

Consider:
- Technical complexity from the description
- Number of acceptance criteria or requirements mentioned
- Whether it's a bug fix (usually lower cost) vs feature (higher cost)
- Presence of detailed specs vs vague requirements
- Labels that indicate scope (enhancement, bug, feature, etc.)

Respond with ONLY a JSON object in this exact format:
{
  "complexity": "low" | "medium" | "high",
  "reasoning": "Brief explanation of your assessment"
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Failed to parse Claude response, using default complexity');
      return { complexity: 'medium', reasoning: 'Unable to parse AI response' };
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing issue with Claude:', error.message);
    // Fallback to simple heuristic
    return fallbackComplexityAnalysis(issue);
  }
}

// Fallback complexity analysis based on simple heuristics
function fallbackComplexityAnalysis(issue) {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  const bodyLength = (issue.body || '').length;
  const hasDetailedDescription = bodyLength > 500;

  // Bug fixes are usually lower complexity
  if (labels.some(l => l.includes('bug') || l.includes('fix'))) {
    return { complexity: 'low', reasoning: 'Bug fix with standard complexity' };
  }

  // Features with detailed descriptions
  if (labels.some(l => l.includes('feature') || l.includes('enhancement'))) {
    if (hasDetailedDescription) {
      return { complexity: 'high', reasoning: 'Feature request with detailed requirements' };
    }
    return { complexity: 'medium', reasoning: 'Feature request with moderate scope' };
  }

  // Default to medium
  return { complexity: 'medium', reasoning: 'Standard complexity based on heuristics' };
}

// Calculate estimated cost based on complexity
function calculateCost(complexity) {
  const range = COST_RANGES[complexity];
  // Return middle of the range
  const estimate = Math.round((range.min + range.max) / 2);
  return estimate;
}

// Convert data to CSV format
function convertToCSV(data) {
  const headers = ['issue_number', 'title', 'complexity', 'estimated_cost', 'labels', 'url'];
  const rows = data.map(item => [
    item.issue_number,
    `"${item.title.replace(/"/g, '""')}"`, // Escape quotes in title
    item.complexity,
    `$${item.estimated_cost}`,
    `"${item.labels.replace(/"/g, '""')}"`,
    item.url
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

// Main API handler
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoUrl } = req.body;

  // Validate input
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  // Validate environment variables
  const githubToken = process.env.GITHUB_TOKEN;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (!githubToken) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  if (!anthropicApiKey) {
    return res.status(500).json({ error: 'Anthropic API key not configured' });
  }

  try {
    // Parse GitHub URL
    const { owner, repo } = parseGitHubUrl(repoUrl);

    // Initialize Octokit
    const octokit = new Octokit({
      auth: githubToken
    });

    // Initialize Anthropic
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey
    });

    // Fetch all open issues
    console.log(`Fetching issues for ${owner}/${repo}...`);
    let allIssues = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        per_page: perPage,
        page
      });

      if (issues.length === 0) break;

      // Filter out pull requests (GitHub API includes them in issues)
      const actualIssues = issues.filter(issue => !issue.pull_request);
      allIssues = allIssues.concat(actualIssues);

      if (issues.length < perPage) break;
      page++;
    }

    console.log(`Found ${allIssues.length} open issues`);

    if (allIssues.length === 0) {
      return res.status(200).json({
        csv: 'issue_number,title,complexity,estimated_cost,labels,url\n',
        message: 'No open issues found in this repository'
      });
    }

    // Analyze each issue with Claude (with rate limiting consideration)
    const results = [];
    for (let i = 0; i < allIssues.length; i++) {
      const issue = allIssues[i];
      console.log(`Analyzing issue ${i + 1}/${allIssues.length}: #${issue.number}`);

      try {
        const analysis = await analyzeIssueWithClaude(issue, anthropic);
        const estimatedCost = calculateCost(analysis.complexity);

        results.push({
          issue_number: issue.number,
          title: issue.title,
          complexity: analysis.complexity,
          estimated_cost: estimatedCost,
          labels: issue.labels.map(l => l.name).join('; '),
          url: issue.html_url
        });

        // Rate limiting: Add a small delay between Claude API calls
        if (i < allIssues.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error analyzing issue #${issue.number}:`, error.message);
        // Add issue with fallback analysis
        const fallback = fallbackComplexityAnalysis(issue);
        results.push({
          issue_number: issue.number,
          title: issue.title,
          complexity: fallback.complexity,
          estimated_cost: calculateCost(fallback.complexity),
          labels: issue.labels.map(l => l.name).join('; '),
          url: issue.html_url
        });
      }
    }

    // Convert to CSV
    const csv = convertToCSV(results);

    // Calculate summary statistics
    const totalCost = results.reduce((sum, item) => sum + item.estimated_cost, 0);
    const complexityCount = {
      low: results.filter(r => r.complexity === 'low').length,
      medium: results.filter(r => r.complexity === 'medium').length,
      high: results.filter(r => r.complexity === 'high').length
    };

    return res.status(200).json({
      csv,
      summary: {
        totalIssues: results.length,
        totalEstimatedCost: totalCost,
        complexityBreakdown: complexityCount
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);

    // Handle specific error types
    if (error.message.includes('Invalid GitHub URL')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.status === 404) {
      return res.status(404).json({
        error: 'Repository not found or you do not have access to it'
      });
    }

    if (error.status === 403) {
      return res.status(403).json({
        error: 'GitHub API rate limit exceeded. Please try again later.'
      });
    }

    return res.status(500).json({
      error: 'An error occurred while processing the repository',
      details: error.message
    });
  }
}

// Increase serverless function timeout for Vercel
export const config = {
  maxDuration: 300, // 5 minutes (requires Pro plan, otherwise defaults to 10s on Hobby)
};
