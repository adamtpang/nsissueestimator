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
        <title>📊 GitHub Issue Cost Estimator</title>
        <meta name="description" content="AI-powered GitHub issue cost estimation tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>" />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 50%, #FFF3E0 100%);
          background-attachment: fixed;
        }

        .card {
          background: white;
          border-radius: 20px;
          border: 2px solid #FFE7C2;
          box-shadow: 0 10px 40px rgba(255, 123, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          box-shadow: 0 20px 60px rgba(255, 123, 0, 0.15);
          transform: translateY(-4px);
          border-color: #FFB700;
        }

        .button-primary {
          background: linear-gradient(135deg, #FF7B00 0%, #FF8800 25%, #FFA200 75%, #FFB700 100%);
          border: none;
          color: white;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(255, 123, 0, 0.35);
          font-size: 16px;
          letter-spacing: 0.02em;
        }

        .button-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(255, 123, 0, 0.45);
        }

        .button-primary:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .button-primary:disabled {
          background: linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%);
          cursor: not-allowed;
          box-shadow: none;
        }

        .input-field {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #FFE7C2;
          border-radius: 14px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
          background: white;
        }

        .input-field:focus {
          border-color: #FF8800;
          box-shadow: 0 0 0 4px rgba(255, 136, 0, 0.1);
        }

        .input-field:disabled {
          background: #F9FAFB;
          cursor: not-allowed;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .badge:hover {
          transform: translateY(-2px);
        }

        .badge-orange {
          background: linear-gradient(135deg, #FFF3E0 0%, #FFE7C2 100%);
          color: #FF7B00;
          border: 2px solid #FFAA00;
        }

        .badge-low {
          background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
          color: #065F46;
          border: 2px solid #10B981;
        }

        .badge-medium {
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          color: #92400E;
          border: 2px solid #FBBF24;
        }

        .badge-high {
          background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
          color: #991B1B;
          border: 2px solid #EF4444;
        }

        .stat-card {
          background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
          padding: 24px;
          border-radius: 16px;
          border: 2px solid #FFE7C2;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: #FFAA00;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 123, 0, 0.1);
        }

        .emoji-large {
          font-size: 72px;
          line-height: 1;
          margin-bottom: 24px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: #1F2937;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          font-size: 28px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .shadow-orange {
          box-shadow: 0 10px 40px rgba(255, 123, 0, 0.15);
        }
      `}</style>

      <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="emoji-large">📊</div>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #FF7B00 0%, #FF8800 25%, #FFA200 50%, #FFB700 75%, #FFC300 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
              lineHeight: '1.1'
            }}>
              GitHub Issue Cost Estimator
            </h1>
            <p style={{ fontSize: '22px', color: '#6B7280', marginBottom: '24px', fontWeight: '500' }}>
              AI-powered cost estimation for your GitHub issues
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-orange">🤖 Claude AI</span>
              <span className="badge badge-orange">⚡ Next.js</span>
              <span className="badge badge-orange">📈 CSV Export</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="card shadow-orange" style={{ padding: '48px', marginBottom: '48px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '32px' }}>
                <label htmlFor="repoUrl" style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '12px', letterSpacing: '0.01em' }}>
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
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>
                  Enter the full URL of any public GitHub repository
                </p>
              </div>

              <button type="submit" disabled={loading} className="button-primary" style={{ width: '100%' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ animation: 'spin 1s linear infinite', marginRight: '12px', height: '22px', width: '22px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

            {/* Error */}
            {error && (
              <div style={{ marginTop: '32px', padding: '20px', background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', border: '2px solid #FCA5A5', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontSize: '24px', marginRight: '16px' }}>⚠️</span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#991B1B', marginBottom: '6px' }}>Error</h3>
                    <p style={{ fontSize: '15px', color: '#B91C1C', margin: 0 }}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success */}
            {summary && (
              <div style={{ marginTop: '32px', padding: '32px', background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)', border: '2px solid #FFAA00', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontSize: '32px', marginRight: '20px' }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1F2937', marginBottom: '24px' }}>
                      Analysis Complete!
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                      <div className="stat-card">
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px', fontWeight: '600' }}>Total Issues</p>
                        <p style={{ fontSize: '42px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7B00 0%, #FFA200 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
                          {summary.totalIssues}
                        </p>
                      </div>
                      <div className="stat-card">
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px', fontWeight: '600' }}>Total Estimated Cost</p>
                        <p style={{ fontSize: '42px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7B00 0%, #FFA200 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
                          ${summary.totalEstimatedCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>Complexity Breakdown</p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div className="badge badge-low">🟢 Low: {summary.complexityBreakdown.low}</div>
                        <div className="badge badge-medium">🟡 Medium: {summary.complexityBreakdown.medium}</div>
                        <div className="badge badge-high">🔴 High: {summary.complexityBreakdown.high}</div>
                      </div>
                    </div>
                    <p style={{ marginTop: '20px', fontSize: '15px', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📥</span> CSV file has been downloaded to your computer!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '48px' }}>
            <div className="card" style={{ padding: '40px' }}>
              <h2 className="section-title">
                <span className="feature-icon">🔍</span>
                How it works
              </h2>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {[
                  { emoji: '1️⃣', text: 'Enter a GitHub repository URL' },
                  { emoji: '2️⃣', text: 'AI analyzes all open issues' },
                  { emoji: '3️⃣', text: 'Get complexity & cost estimates' },
                  { emoji: '4️⃣', text: 'Download detailed CSV report' }
                ].map((step, i) => (
                  <li key={i} style={{ marginBottom: '16px', fontSize: '15px', color: '#4B5563', fontWeight: '500', display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{step.emoji}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card" style={{ padding: '40px' }}>
              <h2 className="section-title">
                <span className="feature-icon">💵</span>
                Cost Ranges
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {[
                  { emoji: '🟢', label: 'Low', range: '$100 - $300', desc: 'Bug fixes, minor changes' },
                  { emoji: '🟡', label: 'Medium', range: '$300 - $600', desc: 'Moderate features' },
                  { emoji: '🔴', label: 'High', range: '$600 - $1,000', desc: 'Complex features' }
                ].map((tier, i) => (
                  <li key={i} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{tier.emoji}</span>
                      <span style={{ fontWeight: '700', color: '#1F2937', fontSize: '15px' }}>{tier.label}:</span>
                      <span style={{ fontWeight: '800', fontSize: '16px', background: 'linear-gradient(135deg, #FF7B00 0%, #FFA200 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {tier.range}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', paddingLeft: '32px', fontWeight: '500' }}>
                      {tier.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '12px', fontWeight: '600' }}>
              Built by{' '}
              <a href="https://adamtomas.fun" target="_blank" rel="noopener noreferrer" style={{ color: '#FF8800', fontWeight: '700', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#FF7B00'} onMouseOut={(e) => e.target.style.color = '#FF8800'}>
                adamtomas.fun
              </a>
              {' '}at{' '}
              <a href="https://ns.com" target="_blank" rel="noopener noreferrer" style={{ color: '#FF8800', fontWeight: '700', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#FF7B00'} onMouseOut={(e) => e.target.style.color = '#FF8800'}>
                ns.com
              </a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#9CA3AF', fontWeight: '600' }}>
              <span>Powered by Claude AI</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>Vercel</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
