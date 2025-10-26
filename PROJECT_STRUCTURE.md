# Project Structure

## Directory Layout

```
nsissueestimator/
├── pages/                      # Next.js pages directory
│   ├── index.js               # Frontend UI (main page)
│   └── api/                   # API routes
│       └── analyze.js         # Issue analysis endpoint
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── vercel.json                # Vercel deployment config
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick start guide
├── DEPLOYMENT.md              # Deployment instructions
├── ARCHITECTURE.md            # System architecture
├── TROUBLESHOOTING.md         # Common issues and solutions
└── PROJECT_STRUCTURE.md       # This file
```

## Core Files

### `pages/index.js`
**Purpose:** Frontend user interface

**Key Components:**
- Form for GitHub URL input
- Loading state with spinner animation
- Error display banner
- Success summary with statistics
- Automatic CSV download functionality
- Info section explaining the tool

**Technologies:**
- React (via Next.js)
- Tailwind CSS (via CDN)
- Browser's download API

**User Flow:**
1. User enters GitHub URL
2. Form validation
3. POST request to `/api/analyze`
4. Loading state displayed
5. CSV auto-downloads
6. Summary statistics shown

---

### `pages/api/analyze.js`
**Purpose:** Main API endpoint for issue analysis

**Key Functions:**

1. **`parseGitHubUrl(url)`**
   - Extracts owner and repo from URL
   - Returns: `{ owner, repo }`

2. **`analyzeIssueWithClaude(issue, anthropic)`**
   - Sends issue data to Claude AI
   - Parses AI response
   - Returns: `{ complexity, reasoning }`

3. **`fallbackComplexityAnalysis(issue)`**
   - Heuristic-based analysis when AI fails
   - Considers labels and description length
   - Returns: `{ complexity, reasoning }`

4. **`calculateCost(complexity)`**
   - Maps complexity to dollar amount
   - Returns middle of range (e.g., $450 for medium)

5. **`convertToCSV(data)`**
   - Transforms array to CSV string
   - Handles quote escaping
   - Returns formatted CSV

6. **`handler(req, res)`** (default export)
   - Main request handler
   - Orchestrates entire flow
   - Returns CSV and summary

**Flow:**
```
Request → Validate → Parse URL → Fetch Issues →
Analyze Each → Calculate Costs → Generate CSV →
Return Response
```

**Error Handling:**
- Input validation
- GitHub API errors
- Claude API errors
- Rate limiting
- Timeouts

---

### `package.json`
**Purpose:** Project configuration and dependencies

**Scripts:**
- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint

**Dependencies:**
- `@anthropic-ai/sdk` - Claude AI integration
- `@octokit/rest` - GitHub API client
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer

---

### `vercel.json`
**Purpose:** Vercel deployment configuration

**Key Settings:**
- `maxDuration: 300` - 5-minute timeout for API
- Framework detection: Next.js
- Environment variable references

---

### `next.config.js`
**Purpose:** Next.js framework configuration

**Settings:**
- `reactStrictMode: true` - Enable React strict mode
- Standard Next.js setup

---

### `.env.example`
**Purpose:** Template for environment variables

**Variables:**
- `GITHUB_TOKEN` - GitHub API authentication
- `ANTHROPIC_API_KEY` - Claude AI authentication

**Usage:**
```bash
cp .env.example .env.local
# Edit .env.local with actual keys
```

---

### `.gitignore`
**Purpose:** Exclude files from Git

**Excludes:**
- `node_modules/` - Dependencies
- `.next/` - Build output
- `.env*.local` - Local environment files
- `.vercel/` - Vercel metadata

## Documentation Files

### `README.md`
- Main project documentation
- Setup instructions
- Feature list
- Deployment guide
- Troubleshooting

### `QUICKSTART.md`
- 5-minute setup guide
- Step-by-step instructions
- Quick test examples

### `DEPLOYMENT.md`
- Vercel deployment steps
- Environment variable setup
- Custom domain configuration
- Monitoring and updates

### `ARCHITECTURE.md`
- System design diagrams
- Data flow explanation
- Component breakdown
- Scalability considerations

### `TROUBLESHOOTING.md`
- Common issues
- Error solutions
- Debug techniques
- Diagnostic checklist

### `PROJECT_STRUCTURE.md` (this file)
- File organization
- Code explanations
- Design decisions

## Data Flow

### Request Flow
```
Browser (pages/index.js)
    ↓ POST /api/analyze
API Endpoint (pages/api/analyze.js)
    ↓ Fetch issues
GitHub API (@octokit/rest)
    ↓ Return issues
API Endpoint
    ↓ Analyze each issue
Claude API (@anthropic-ai/sdk)
    ↓ Return analysis
API Endpoint
    ↓ Generate CSV
Browser
    ↓ Download CSV
User's Computer
```

### File Relationships

```
package.json
    ↓ defines dependencies
node_modules/
    ↓ used by
pages/api/analyze.js
    ↓ called by
pages/index.js
    ↓ served by
Next.js
    ↓ deployed to
Vercel
```

## Environment Setup

### Development
```
.env.local        → Local environment variables
↓ loaded by
next dev          → Development server
↓ serves
localhost:3000    → Local testing
```

### Production
```
Vercel Dashboard  → Environment variables
↓ used by
Vercel Build      → Production build
↓ deploys to
Vercel Serverless → Production environment
↓ serves
your-app.vercel.app
```

## Code Organization

### Frontend (`pages/index.js`)
- **State Management**: React hooks (useState)
- **API Calls**: Fetch API
- **File Download**: Blob API
- **Styling**: Tailwind CSS classes

### Backend (`pages/api/analyze.js`)
- **Pattern**: Serverless function
- **Error Handling**: Try-catch blocks
- **Rate Limiting**: Delays between API calls
- **Fallbacks**: Heuristic analysis when AI fails

## Configuration Files

### `next.config.js`
```javascript
// Minimal configuration
// Enables React strict mode
// Standard Next.js setup
```

### `vercel.json`
```javascript
// Extends API timeout to 5 minutes
// Maps environment variables
// Framework detection
```

## Adding New Features

### Add new API endpoint:
1. Create `pages/api/newroute.js`
2. Export default async handler
3. Access via `/api/newroute`

### Modify frontend:
1. Edit `pages/index.js`
2. Changes auto-reload in dev mode
3. Use React hooks for state

### Add dependencies:
```bash
npm install package-name
# Automatically updates package.json
```

## Build Output

### Development (`npm run dev`)
```
.next/               # Build cache (not committed)
├── cache/
├── server/
└── static/
```

### Production (`npm run build`)
```
.next/               # Optimized build
├── cache/
├── server/          # Server-side code
│   └── pages/
│       └── api/
│           └── analyze.js
└── static/          # Static assets
```

## Testing Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Add your API keys
```

### 3. Start dev server
```bash
npm run dev
```

### 4. Test in browser
```
Open: http://localhost:3000
Enter: https://github.com/vercel/next.js
Click: Analyze Repository
```

## Deployment Files

When deploying to Vercel, these files are used:

**Required:**
- `package.json` - Dependencies
- `pages/` - Application code
- `next.config.js` - Configuration

**Optional but recommended:**
- `vercel.json` - Deployment settings
- `.gitignore` - Exclude files
- `README.md` - Documentation

**Environment variables** (set in Vercel Dashboard):
- `GITHUB_TOKEN`
- `ANTHROPIC_API_KEY`

## Key Design Decisions

### Why Next.js?
- Built-in API routes (serverless functions)
- Easy Vercel deployment
- React for UI
- Server-side rendering support

### Why Serverless?
- No server management
- Auto-scaling
- Pay per execution
- Easy deployment

### Why CSV?
- Universal format
- Easy to import into spreadsheets
- No database needed
- Simple parsing

### Why Tailwind CDN?
- No build step needed
- Fast prototyping
- Minimal setup
- Good enough for single page

## Future Enhancements

Potential additions:

1. **Database** - Cache results
2. **Authentication** - User accounts
3. **Batch Processing** - Queue system
4. **WebSocket** - Real-time progress
5. **Custom Ranges** - User-defined costs
6. **History** - View past analyses
7. **Export Formats** - JSON, Excel, PDF
8. **Filtering** - Analyze specific labels

Would require adding:
- Database (Vercel Postgres, MongoDB)
- Auth (NextAuth.js)
- Queue (Vercel KV, Redis)
- More pages and components
