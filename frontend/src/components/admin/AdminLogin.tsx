import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If already logged in, redirect straight to /admin/dashboard
  useEffect(() => {
    let isMounted = true;
    authService.checkStatus()
      .then((status) => {
        if (isMounted) {
          if (status.authenticated) {
            navigate('/admin/dashboard', { replace: true });
          } else {
            setChecking(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) setChecking(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      if (!errObj.response) {
        setError('Cannot connect to backend server. Please verify the backend is running.');
      } else {
        setError(errObj.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--ink-soft)'
      }}>
        <div className="section-loading">
          <span className="section-loading__spinner" /> Loading Admin Portal...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '0.4rem', fontSize: '1.75rem' }}>
            Admin Login
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', margin: 0 }}>
            Sign in to manage your portfolio content
          </p>
        </div>

        {error && (
          <div className="section-error" style={{ margin: '0 0 1.25rem 0', padding: '0.75rem', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.75rem', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ink-soft, #64748b)',
                  borderRadius: '4px',
                }}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
            ← Return to Portfolio Website
          </a>
        </div>
      </div>
    </div>
  );
}
