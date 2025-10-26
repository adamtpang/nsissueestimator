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
        <title>GitHub Issue Cost Estimator</title>
        <meta name="description" content="AI-powered GitHub issue cost estimation tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              GitHub Issue Cost Estimator
            </h1>
            <p className="text-lg text-gray-600">
              AI-powered cost estimation for your GitHub issues
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by Claude AI and GitHub API
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="repoUrl"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the full URL of a public GitHub repository
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Issues...
                  </span>
                ) : (
                  'Analyze Repository'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Summary */}
            {summary && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Analysis Complete!
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-md">
                        <p className="text-gray-600">Total Issues</p>
                        <p className="text-2xl font-bold text-gray-900">{summary.totalIssues}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <p className="text-gray-600">Total Estimated Cost</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${summary.totalEstimatedCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 bg-white p-3 rounded-md">
                      <p className="text-gray-600 font-medium mb-2">Complexity Breakdown</p>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                          Low: {summary.complexityBreakdown.low}
                        </div>
                        <div>
                          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                          Medium: {summary.complexityBreakdown.medium}
                        </div>
                        <div>
                          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                          High: {summary.complexityBreakdown.high}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      CSV file has been downloaded to your computer.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">How it works</h2>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">1.</span>
                <span>Enter a GitHub repository URL</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">2.</span>
                <span>Our AI analyzes all open issues for complexity and scope</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">3.</span>
                <span>Each issue is assigned a complexity level and estimated cost</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">4.</span>
                <span>Download a CSV file with detailed cost estimates</span>
              </li>
            </ol>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Cost Ranges</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><span className="font-medium text-green-600">Low:</span> $100 - $300 (bug fixes, minor changes)</li>
                <li><span className="font-medium text-yellow-600">Medium:</span> $300 - $600 (moderate features)</li>
                <li><span className="font-medium text-red-600">High:</span> $600 - $1,000 (complex features)</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Built with Next.js, Claude AI, and GitHub API</p>
          </div>
        </div>
      </main>
    </>
  );
}
