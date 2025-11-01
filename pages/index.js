import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [issuesData, setIssuesData] = useState([]);
  const [csvData, setCsvData] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [eta, setEta] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  const examples = [
    { name: 'Anthropic SDK', url: 'https://github.com/anthropics/anthropic-sdk-python', logo: '🤖' },
    { name: 'Next.js', url: 'https://github.com/vercel/next.js', logo: '▲' },
    { name: 'React', url: 'https://github.com/facebook/react', logo: '⚛️' },
    { name: 'Vercel', url: 'https://github.com/vercel/vercel', logo: '▲' }
  ];

  useEffect(() => {
    if (loading && startTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const estimatedTotal = elapsed / (progress / 100);
        const remaining = Math.max(0, estimatedTotal - elapsed);
        setEta(Math.ceil(remaining));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading, startTime, progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSummary(null);
    setIssuesData([]);
    setLoading(true);
    setProgress(0);
    setCurrentPhase('fetching');
    setStartTime(Date.now());
    setEta(30);

    try {
      // Start fetching phase
      setProgress(10);
      setCurrentPhase('fetching');
      
      const startTime = Date.now();
      
      // Move to analyzing after initial fetch (1.5 seconds)
      setTimeout(() => {
        setProgress(30);
        setCurrentPhase('analyzing');
      }, 1500);

      // Continue progressing through analysis phase based on expected time
      const analysisTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed > 2000 && elapsed < 20000) { // Between 2-20 seconds
          const analysisProgress = 30 + ((elapsed - 2000) / 18000) * 50; // Progress from 30% to 80%
          setProgress(Math.min(80, analysisProgress));
        }
      }, 1000);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      // Clear analysis timer and move to generating
      clearInterval(analysisTimer);
      setProgress(90);
      setCurrentPhase('generating');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      setProgress(100);
      setCurrentPhase('complete');
      setEta(0);

      setCsvData(data.csv);
      setSummary(data.summary);

      const lines = data.csv.split('\n').slice(1);
      const issues = lines.filter(line => line.trim()).map(line => {
        const parts = line.match(/^(\d+),"([^"]+)",(\w+),\$(\d+),"([^"]*)",(https:\/\/[^\s]+)/);
        if (parts) {
          return {
            number: parts[1],
            title: parts[2],
            complexity: parts[3],
            cost: parts[4],
            labels: parts[5],
            url: parts[6]
          };
        }
        return null;
      }).filter(Boolean);

      setIssuesData(issues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const repoName = repoUrl.split('/').slice(-1)[0].replace(/\.git$/, '');
    a.download = `${repoName}-cost-estimate-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadSingleIssue = (issue) => {
    const csv = `issue_number,title,complexity,estimated_cost,labels,url\n${issue.number},"${issue.title}",${issue.complexity},$${issue.cost},"${issue.labels}",${issue.url}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `issue-${issue.number}-estimate.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const previewIssueCSV = (issue) => {
    setSelectedIssue(issue);
    setShowCsvPreview(true);
  };

  const getSingleIssueCSV = (issue) => {
    return `issue_number,title,complexity,estimated_cost,labels,url\n${issue.number},"${issue.title}",${issue.complexity},$${issue.cost},"${issue.labels}",${issue.url}`;
  };

  const handleExampleClick = (url) => {
    setRepoUrl(url);
  };

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case 'low': return { bg: '#FDF2F8', border: '#10B981', text: '#166534' };
      case 'medium': return { bg: '#FFFBEB', border: '#FBBF24', text: '#92400E' };
      case 'high': return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' };
      default: return { bg: '#F9FAFB', border: '#D1D5DB', text: '#374151' };
    }
  };

  const formatEta = (seconds) => {
    if (seconds < 60) return `~${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `~${minutes}m ${secs}s`;
  };

  return (
    <>
      <Head>
        <title>📊 GitHub Issue Cost Estimator</title>
        <meta name="description" content="AI-powered GitHub issue cost estimation tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>" />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #FDF2F8 0%, #FFFFFF 50%, #FCE7F3 100%);
          background-attachment: fixed;
          min-height: 100vh;
        }

        .card {
          background: white;
          border-radius: 20px;
          border: 2px solid #CE4257;
          box-shadow: 0 10px 40px rgba(206, 66, 87, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          box-shadow: 0 20px 60px rgba(206, 66, 87, 0.12);
        }

        .button-primary {
          background: linear-gradient(135deg, #4F000B 0%, #720026 25%, #FF7F51 75%, #CE4257 100%);
          border: none;
          color: white;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(206, 66, 87, 0.35);
          font-size: 16px;
        }

        .button-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(206, 66, 87, 0.45);
        }

        .button-primary:disabled {
          background: linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%);
          cursor: not-allowed;
          box-shadow: none;
        }

        .button-secondary {
          padding: 8px 16px;
          background: white;
          border: 2px solid #CE4257;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #720026;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .button-secondary:hover {
          background: linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%);
          border-color: #FF7F51;
        }

        .example-button {
          padding: 10px 18px;
          background: white;
          border: 2px solid #CE4257;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #720026;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .example-button:hover {
          background: linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%);
          border-color: #FF7F51;
          transform: translateY(-2px);
        }

        .input-field {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #CE4257;
          border-radius: 14px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }

        .input-field:focus {
          border-color: #FF7F51;
          box-shadow: 0 0 0 4px rgba(206, 66, 87, 0.1);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .badge-green {
          background: linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%);
          color: #720026;
          border: 2px solid #FF7F51;
        }

        .stat-box {
          background: linear-gradient(135deg, #FDF2F8 0%, #FFFFFF 100%);
          padding: 20px;
          border-radius: 14px;
          border: 2px solid #CE4257;
          text-align: center;
        }

        .emoji-hero {
          font-size: 80px;
          line-height: 1;
          margin-bottom: 20px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #F3F4F6;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4F000B 0%, #55A630 50%, #CE4257 100%);
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .phase-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #9CA3AF;
          transition: all 0.3s ease;
        }

        .phase-active {
          background: linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%);
          border-color: #FF7F51;
          color: #720026;
          box-shadow: 0 4px 12px rgba(206, 66, 87, 0.2);
        }

        .phase-complete {
          background: #FCE7F3;
          border-color: #FF7F51;
          color: #4F000B;
        }

        .issue-card {
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .issue-card:hover {
          border-color: #FF7F51;
          box-shadow: 0 4px 16px rgba(206, 66, 87, 0.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <main style={{ width: '100%', padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="emoji-hero">📊</div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #4F000B 0%, #720026 25%, #CE4257 50%, #FF7F51 75%, #FF9B54 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}>
              GitHub Issue<br/>Cost Estimator
            </h1>
            <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '20px', fontWeight: '500', lineHeight: '1.6' }}>
              Transform GitHub issues into actionable cost estimates using AI.<br/>
              Analyze complexity, generate budget reports, and download structured CSV data.
            </p>
          </div>

          <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="repoUrl" style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '10px' }}>
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="repoUrl"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="input-field"
                  required
                  disabled={loading}
                />
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>
                  Enter the repository URL to analyze open issues
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '10px' }}>
                  Try these examples:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {examples.map((example, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleExampleClick(example.url)}
                      className="example-button"
                      disabled={loading}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <span style={{ fontSize: '16px' }}>{example.logo}</span>
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="button-primary" style={{ width: '100%' }}>
                {loading ? 'Analyzing...' : '🚀 Analyze Repository'}
              </button>
            </form>

            {loading && (
              <div style={{ marginTop: '32px', padding: '24px', background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)', border: '2px solid #FF7F51', borderRadius: '14px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '40px', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>🔍</span>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937', margin: '12px 0 8px 0' }}>
                    Analyzing Repository
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                    Fetching issues and calculating costs...
                  </p>
                  {eta > 0 && (
                    <p style={{ fontSize: '13px', color: '#720026', fontWeight: '700', margin: '8px 0 0 0' }}>
                      {formatEta(eta)} remaining
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Progress</span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#720026' }}>{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`phase-indicator ${currentPhase === 'fetching' ? 'phase-active' : ''} ${['analyzing', 'generating', 'complete'].includes(currentPhase) ? 'phase-complete' : ''}`}>
                    {currentPhase === 'fetching' || ['analyzing', 'generating', 'complete'].includes(currentPhase) ? '✓' : ''} fetching
                  </span>
                  <span className={`phase-indicator ${currentPhase === 'analyzing' ? 'phase-active' : ''} ${['generating', 'complete'].includes(currentPhase) ? 'phase-complete' : ''}`}>
                    {currentPhase === 'analyzing' || ['generating', 'complete'].includes(currentPhase) ? '✓' : ''} analyzing
                  </span>
                  <span className={`phase-indicator ${currentPhase === 'generating' ? 'phase-active' : ''} ${currentPhase === 'complete' ? 'phase-complete' : ''}`}>
                    {currentPhase === 'generating' || currentPhase === 'complete' ? '✓' : ''} generating
                  </span>
                  <span className={`phase-indicator ${currentPhase === 'complete' ? 'phase-active' : ''}`}>
                    {currentPhase === 'complete' ? '✓' : ''} complete
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', border: '2px solid #FCA5A5', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#991B1B', margin: '0 0 4px 0' }}>Error</h3>
                    <p style={{ fontSize: '14px', color: '#B91C1C', margin: 0 }}>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {summary && (
            <>
              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '48px' }}>✅</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1F2937', margin: '12px 0 0 0' }}>
                    Analysis Complete!
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div className="stat-box">
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>Total Issues</p>
                    <p style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(135deg, #720026 0%, #FF7F51 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
                      {summary.totalIssues}
                    </p>
                  </div>
                  <div className="stat-box">
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>Estimated Cost</p>
                    <p style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(135deg, #720026 0%, #FF7F51 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
                      ${summary.totalEstimatedCost.toLocaleString()}
                    </p>
                  </div>
                  <div className="stat-box">
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>Avg per Issue</p>
                    <p style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(135deg, #720026 0%, #FF7F51 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
                      ${Math.round(summary.totalEstimatedCost / summary.totalIssues)}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '2px solid #E5E7EB', marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '12px', textAlign: 'center' }}>Complexity Breakdown</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '6px 12px', background: '#FDF2F8', color: '#166534', borderRadius: '16px', fontSize: '13px', fontWeight: '600', border: '2px solid #10B981' }}>
                      🟢 Low: {summary.complexityBreakdown.low}
                    </span>
                    <span style={{ padding: '6px 12px', background: '#FFFBEB', color: '#92400E', borderRadius: '16px', fontSize: '13px', fontWeight: '600', border: '2px solid #FBBF24' }}>
                      🟡 Medium: {summary.complexityBreakdown.medium}
                    </span>
                    <span style={{ padding: '6px 12px', background: '#FEF2F2', color: '#991B1B', borderRadius: '16px', fontSize: '13px', fontWeight: '600', border: '2px solid #EF4444' }}>
                      🔴 High: {summary.complexityBreakdown.high}
                    </span>
                  </div>
                </div>

                <button onClick={downloadCSV} className="button-primary" style={{ width: '100%' }}>
                  📥 Download Complete CSV Report
                </button>
              </div>

              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>💵</span>
                  Cost Ranges
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { emoji: '🟢', label: 'Low', range: '$100 - $300', desc: 'Bug fixes, minor changes' },
                    { emoji: '🟡', label: 'Medium', range: '$300 - $600', desc: 'Moderate features' },
                    { emoji: '🔴', label: 'High', range: '$600 - $1,000', desc: 'Complex features' }
                  ].map((tier, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{tier.emoji}</span>
                          <span style={{ fontWeight: '700', color: '#1F2937', fontSize: '15px' }}>{tier.label}</span>
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '15px', background: 'linear-gradient(135deg, #720026 0%, #FF7F51 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          {tier.range}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#6B7280', fontSize: '13px', paddingLeft: '26px' }}>
                        {tier.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                    📋 Issue Breakdown ({issuesData.length} issues)
                  </h3>
                </div>

                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
                  {issuesData.map((issue, i) => {
                    const colors = getComplexityColor(issue.complexity);
                    return (
                      <div key={i} className="issue-card" onClick={() => previewIssueCSV(issue)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#9CA3AF' }}>#{issue.number}</span>
                              <span style={{
                                padding: '4px 10px',
                                background: colors.bg,
                                color: colors.text,
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '700',
                                border: `2px solid ${colors.border}`
                              }}>
                                {issue.complexity.toUpperCase()}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                              {issue.title}
                            </h4>
                            {issue.labels && (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                {issue.labels.split(';').filter(l => l.trim()).map((label, idx) => (
                                  <span key={idx} style={{
                                    padding: '3px 8px',
                                    background: '#F3F4F6',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    color: '#6B7280',
                                    fontWeight: '600'
                                  }}>
                                    {label.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                            <p style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg, #720026 0%, #FF7F51 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 8px 0' }}>
                              ${issue.cost}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                          <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '13px', color: '#720026', fontWeight: '600', textDecoration: 'none' }}
                          >
                            View on GitHub →
                          </a>
                          <button
                            onClick={() => downloadSingleIssue(issue)}
                            className="button-secondary"
                          >
                            📄 Download CSV
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '10px', fontWeight: '600' }}>
              Built by{' '}
              <a href="https://adamtomas.fun" target="_blank" rel="noopener noreferrer" style={{ color: '#720026', fontWeight: '700', textDecoration: 'none' }}>
                adamtomas.fun
              </a>
              {' '}at{' '}
              <a href="https://ns.com" target="_blank" rel="noopener noreferrer" style={{ color: '#720026', fontWeight: '700', textDecoration: 'none' }}>
                ns.com
              </a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '13px', color: '#9CA3AF', fontWeight: '600', flexWrap: 'wrap' }}>
              <span>Powered by Claude AI</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>Vercel</span>
            </div>
          </div>

        </div>
      </main>

      {/* CSV Preview Modal */}
      {showCsvPreview && selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80%',
            overflow: 'auto',
            border: '2px solid #CE4257'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                📄 CSV Preview - Issue #{selectedIssue.number}
              </h3>
              <button
                onClick={() => setShowCsvPreview(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#9CA3AF'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
                {selectedIssue.title}
              </h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '600' }}>
                  #{selectedIssue.number}
                </span>
                <span style={{
                  padding: '4px 10px',
                  background: getComplexityColor(selectedIssue.complexity).bg,
                  color: getComplexityColor(selectedIssue.complexity).text,
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: `2px solid ${getComplexityColor(selectedIssue.complexity).border}`
                }}>
                  {selectedIssue.complexity.toUpperCase()}
                </span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #720026 0%, #FF7F51 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ${selectedIssue.cost}
                </span>
              </div>
            </div>

            <div style={{
              background: '#F9FAFB',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>
                CSV Data Preview:
              </h5>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                overflow: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px'
                }}>
                  <thead>
                    <tr style={{ background: '#F3F4F6' }}>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '700', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Issue #</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '700', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Title</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '700', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Complexity</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '700', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Cost</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '700', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Labels</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '700', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #E5E7EB', color: '#4B5563', fontWeight: '600' }}>{selectedIssue.number}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #E5E7EB', color: '#1F2937', fontWeight: '500', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedIssue.title}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #E5E7EB' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: getComplexityColor(selectedIssue.complexity).bg,
                          color: getComplexityColor(selectedIssue.complexity).text,
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: `1px solid ${getComplexityColor(selectedIssue.complexity).border}`
                        }}>
                          {selectedIssue.complexity.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #E5E7EB', fontWeight: '700', color: '#720026' }}>${selectedIssue.cost}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedIssue.labels || 'None'}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #E5E7EB' }}>
                        <a
                          href={selectedIssue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#720026', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}
                        >
                          View Issue →
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div style={{ marginTop: '12px' }}>
                <details>
                  <summary style={{ fontSize: '12px', color: '#6B7280', cursor: 'pointer', fontWeight: '600' }}>
                    View Raw CSV Data
                  </summary>
                  <pre style={{
                    fontSize: '11px',
                    color: '#4B5563',
                    background: '#F9FAFB',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    margin: '8px 0 0 0',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {getSingleIssueCSV(selectedIssue)}
                  </pre>
                </details>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCsvPreview(false)}
                className="button-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  downloadSingleIssue(selectedIssue);
                  setShowCsvPreview(false);
                }}
                className="button-primary"
              >
                📥 Download CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
