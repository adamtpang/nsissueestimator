# System Architecture

## Overview

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │
       │ 1. Enter GitHub URL
       │
       ▼
┌─────────────────────────────┐
│     Frontend (index.js)     │
│   - Form input              │
│   - Loading state           │
│   - CSV download            │
│   - Results display         │
└──────────┬──────────────────┘
           │
           │ 2. POST /api/analyze
           │    { repoUrl: "..." }
           │
           ▼
┌────────────────────────────────────┐
│   API Endpoint (analyze.js)        │
│                                    │
│   ┌─────────────────────────┐     │
│   │  1. Parse GitHub URL    │     │
│   │  2. Fetch all issues    │◄────┼───┐
│   │  3. Analyze with AI     │     │   │
│   │  4. Calculate costs     │◄────┼───┤
│   │  5. Generate CSV        │     │   │
│   └─────────────────────────┘     │   │
│                                    │   │
└────────────────────────────────────┘   │
           │                             │
           │                             │
           ├─────────────────────────────┤
           │                             │
    ┌──────▼───────┐          ┌─────────▼────────┐
    │   GitHub     │          │   Anthropic      │
    │     API      │          │   Claude API     │
    │              │          │                  │
    │  - List      │          │  - Analyze       │
    │    issues    │          │    complexity    │
    │  - Get       │          │  - Estimate      │
    │    comments  │          │    effort        │
    └──────────────┘          └──────────────────┘
```

## Data Flow

### 1. User Input
- User enters: `https://github.com/owner/repo`
- Frontend validates URL format
- Sends POST request to `/api/analyze`

### 2. GitHub API Integration
```javascript
// Fetch all open issues (paginated)
GET /repos/{owner}/{repo}/issues
  ?state=open
  &per_page=100
  &page=1

// Response includes:
- Issue number
- Title
- Body/description
- Labels
- Comments count
- HTML URL
```

### 3. AI Analysis (Per Issue)
```javascript
// For each issue, send to Claude:
Prompt:
  - Issue title
  - Issue body
  - Labels
  - Comments count

Claude analyzes:
  ✓ Technical complexity
  ✓ Scope indicators
  ✓ Bug vs feature
  ✓ Specification quality

Returns:
{
  complexity: "low" | "medium" | "high",
  reasoning: "..."
}
```

### 4. Cost Calculation
```javascript
Complexity → Cost Range:
  low:    $100 - $300  (avg: $200)
  medium: $300 - $600  (avg: $450)
  high:   $600 - $1000 (avg: $800)
```

### 5. CSV Generation
```csv
issue_number,title,complexity,estimated_cost,labels,url
123,"Feature X",high,$800,"enhancement","https://..."
```

### 6. Response to Frontend
```json
{
  "csv": "issue_number,title,...\n123,Feature X,...",
  "summary": {
    "totalIssues": 50,
    "totalEstimatedCost": 25000,
    "complexityBreakdown": {
      "low": 20,
      "medium": 20,
      "high": 10
    }
  }
}
```

## Key Components

### Frontend (`pages/index.js`)
- **Purpose**: User interface and interaction
- **Technologies**: React, Next.js, Tailwind CSS
- **Key Features**:
  - Form validation
  - Loading states with spinner
  - Automatic CSV download
  - Summary statistics display
  - Error handling UI

### API Endpoint (`pages/api/analyze.js`)
- **Purpose**: Orchestrate GitHub + AI analysis
- **Technologies**: Node.js, Octokit, Anthropic SDK
- **Key Features**:
  - URL parsing and validation
  - Paginated issue fetching
  - AI-powered complexity analysis
  - Fallback heuristics
  - Rate limiting protection
  - CSV generation

### AI Analysis Strategy
```
Input: Issue data
  ↓
Claude analyzes:
  - Keywords in title/body
  - Technical depth
  - Requirements count
  - Bug vs feature labels
  - Specification clarity
  ↓
Output: Complexity level
  ↓
Map to cost range
```

## Error Handling

### Frontend Errors
- Invalid URL format → Inline validation
- Network errors → Red error banner
- API errors → Display error message

### API Errors
```javascript
400 Bad Request → Invalid input
403 Forbidden  → Rate limit exceeded
404 Not Found  → Repo doesn't exist
500 Internal   → Server error
```

### Fallback Mechanisms
1. **AI Unavailable**: Use heuristic analysis
2. **Rate Limit**: Add delays, return partial results
3. **Issue Parse Error**: Skip issue, continue with others

## Performance Considerations

### Bottlenecks
1. **GitHub API**: 5000 requests/hour limit
2. **Claude API**: Rate-limited by plan
3. **Processing Time**: ~0.5s per issue

### Optimizations
- Pagination for large repos
- 500ms delay between AI calls
- Efficient CSV generation
- Single HTTP request from frontend

### Time Estimates
| Issues | Estimated Time |
|--------|----------------|
| 10     | ~10 seconds    |
| 50     | ~30 seconds    |
| 100    | ~1 minute      |
| 500    | ~5 minutes     |

## Security

### Environment Variables
```
GITHUB_TOKEN      → Server-side only
ANTHROPIC_API_KEY → Server-side only
```

### API Protection
- No authentication required (public tool)
- Rate limiting via API providers
- Input validation
- No sensitive data stored

## Scalability

### Current Limitations
- Synchronous processing
- 300-second function timeout (Vercel Pro)
- Memory constraints on serverless

### Future Improvements
- Queue-based processing
- Webhook for completion
- Database for caching
- Batch processing
- Progress updates via WebSocket

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React, Next.js, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| GitHub API | @octokit/rest |
| AI Analysis | @anthropic-ai/sdk (Claude) |
| Hosting | Vercel |
| Storage | None (stateless) |

## Deployment Architecture

```
GitHub Repo
    ↓
Vercel Build
    ↓
┌──────────────────┐
│  Static Assets   │
│  (Frontend)      │
└──────────────────┘
    ↓
┌──────────────────┐
│ Serverless Func  │
│ (API Routes)     │
└──────────────────┘
    ↓
Production URL
```

## Cost Analysis

### Per Request
- GitHub API: Free (up to 5000/hour)
- Claude API: ~$0.003 per issue
- Vercel: Free (Hobby) or $20/month (Pro)

### Example
Analyzing 100 issues:
- GitHub: $0
- Claude: ~$0.30
- Vercel: Included in plan

**Total: ~$0.30 per 100 issues**
