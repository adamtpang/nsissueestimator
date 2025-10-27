import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSummary(null);
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      // Create and download CSV file
      const blob = new Blob([data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract repo name for filename
      const repoName = repoUrl.split('/').slice(-1)[0].replace(/\.git$/, '');
      a.download = `${repoName}-cost-estimate-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show summary
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>💰 GitHub Issue Cost Estimator</title>
        <meta name="description" content="AI-powered GitHub issue cost estimation tool - turn issues into budgeted tasks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💰</text></svg>" />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .gradient-bg {
          background: linear-gradient(135deg, #FEF5EE 0%, #FDEBD7 25%, #FFF 50%, #FEF5EE 75%, #FDEBD7 100%);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(242, 92, 84, 0.1), 0 2px 4px -1px rgba(242, 92, 84, 0.06);
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(242, 92, 84, 0.1), 0 10px 10px -5px rgba(242, 92, 84, 0.04);
          transform: translateY(-2px);
        }

        .button-primary {
          background: linear-gradient(135deg, #F4845F 0%, #F27059 50%, #F25C54 100%);
          border: none;
          color: white;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(242, 92, 84, 0.3), 0 2px 4px -1px rgba(242, 92, 84, 0.2);
        }

        .button-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 16px -4px rgba(242, 92, 84, 0.4), 0 4px 6px -2px rgba(242, 92, 84, 0.3);
        }

        .button-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .button-primary:disabled {
          background: #D1D5DB;
          cursor: not-allowed;
          box-shadow: none;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #FBCDAE;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }

        .input-field:focus {
          border-color: #F4845F;
          box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.1);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .badge-low {
          background: #D1FAE5;
          color: #065F46;
        }

        .badge-medium {
          background: #FEF3C7;
          color: #92400E;
        }

        .badge-high {
          background: #FEE2E2;
          color: #991B1B;
        }

        .stat-card {
          background: linear-gradient(135deg, #FEF5EE 0%, #FFF 100%);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #FBCDAE;
        }

        .emoji-large {
          font-size: 48px;
          margin-bottom: 16px;
        }
      `}</style>

      <main className="gradient-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="emoji-large">💰</div>
            <h1 style={{ fontSize: '44px', fontWeight: '800', color: '#1F2937', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              GitHub Issue Cost Estimator
            </h1>
            <p style={{ fontSize: '20px', color: '#6B7280', marginBottom: '12px' }}>
              AI-powered cost estimation for your GitHub issues
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#FEF5EE', color: '#F27059' }}>🤖 Claude AI</span>
              <span className="badge" style={{ background: '#FEF5EE', color: '#F27059' }}>⚡ Next.js</span>
              <span className="badge" style={{ background: '#FEF5EE', color: '#F27059' }}>📊 CSV Export</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="repoUrl" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
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
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#9CA3AF' }}>
                  Enter the full URL of any public GitHub repository
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button-primary"
                style={{ width: '100%', fontSize: '16px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ animation: 'spin 1s linear infinite', marginRight: '12px', height: '20px', width: '20px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Issues...
                  </span>
                ) : (
                  '🚀 Analyze Repository'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div style={{ marginTop: '24px', padding: '16px', background: '#FEE2E2', border: '2px solid #FCA5A5', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontSize: '20px', marginRight: '12px' }}>⚠️</span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#991B1B', marginBottom: '4px' }}>Error</h3>
                    <p style={{ fontSize: '14px', color: '#B91C1C' }}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Summary */}
            {summary && (
              <div style={{ marginTop: '24px', padding: '24px', background: 'linear-gradient(135deg, #FEF5EE 0%, #FFF 100%)', border: '2px solid #F7B267', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontSize: '28px', marginRight: '16px' }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>
                      Analysis Complete!
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div className="stat-card">
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Total Issues</p>
                        <p style={{ fontSize: '32px', fontWeight: '800', color: '#F27059' }}>{summary.totalIssues}</p>
                      </div>
                      <div className="stat-card">
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Total Estimated Cost</p>
                        <p style={{ fontSize: '32px', fontWeight: '800', color: '#F27059' }}>
                          ${summary.totalEstimatedCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Complexity Breakdown</p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div className="badge-low">
                          Low: {summary.complexityBreakdown.low}
                        </div>
                        <div className="badge-medium">
                          Medium: {summary.complexityBreakdown.medium}
                        </div>
                        <div className="badge-high">
                          High: {summary.complexityBreakdown.high}
                        </div>
                      </div>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                      📥 CSV file has been downloaded to your computer!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* How it works */}
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>🔍</span> How it works
              </h2>
              <ol style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
                {[
                  { emoji: '1️⃣', text: 'Enter a GitHub repository URL' },
                  { emoji: '2️⃣', text: 'AI analyzes all open issues for complexity' },
                  { emoji: '3️⃣', text: 'Each issue gets a cost estimate' },
                  { emoji: '4️⃣', text: 'Download CSV with detailed breakdown' }
                ].map((step, i) => (
                  <li key={i} style={{ marginBottom: '12px', fontSize: '14px', color: '#4B5563', display: 'flex', alignItems: 'start' }}>
                    <span style={{ marginRight: '8px', fontSize: '16px' }}>{step.emoji}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Cost Ranges */}
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>💵</span> Cost Ranges
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {[
                  { emoji: '🟢', label: 'Low', range: '$100 - $300', desc: 'Bug fixes, minor changes' },
                  { emoji: '🟡', label: 'Medium', range: '$300 - $600', desc: 'Moderate features' },
                  { emoji: '🔴', label: 'High', range: '$600 - $1,000', desc: 'Complex features' }
                ].map((tier, i) => (
                  <li key={i} style={{ marginBottom: '16px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>{tier.emoji}</span>
                      <span style={{ fontWeight: '600', color: '#1F2937', marginRight: '8px' }}>{tier.label}:</span>
                      <span style={{ color: '#F27059', fontWeight: '700' }}>{tier.range}</span>
                    </div>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '13px', paddingLeft: '28px' }}>{tier.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
              Built by <a href="https://adamtomas.fun" target="_blank" rel="noopener noreferrer" style={{ color: '#F27059', fontWeight: '600', textDecoration: 'none' }}>adamtomas.fun</a> at <a href="https://ns.com" target="_blank" rel="noopener noreferrer" style={{ color: '#F27059', fontWeight: '600', textDecoration: 'none' }}>ns.com</a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#9CA3AF' }}>
              <span>Powered by Claude AI</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>Vercel</span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
