import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use admin / admin');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="login-wrapper">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center px-8 pt-8 pb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-accent-cyan/20">
              S
            </div>
            <h1 className="text-lg font-bold text-white mb-1">SmartRes</h1>
            <p className="text-xs text-dark-200">Resource Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2">
            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-accent-rose/10 border border-accent-rose/20 text-xs text-accent-rose">
                {error}
              </div>
            )}

            <div className="mb-3.5">
              <label className="block text-2xs font-semibold text-dark-200 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                className="w-full bg-dark-750 border border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all"
              />
            </div>

            <div className="mb-5">
              <label className="block text-2xs font-semibold text-dark-200 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full bg-dark-750 border border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent-cyan to-accent-blue hover:from-accent-cyan/90 hover:to-accent-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-cyan/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-2xs text-dark-400 mt-4">
              Hint: admin / admin
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
