import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await login(email, password);

      // Route based on role or intended destination
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (data.user.role === 'INSTRUCTOR') {
        navigate('/instructor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const isConnectionIssue = err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || !err.response;
      const errorMsg = err.response?.data?.message 
        || (isConnectionIssue 
            ? 'Unable to connect to the backend server. Please verify your backend server is running on port 8080 (or wait if waking up from cloud sleep).' 
            : 'Invalid email or password.');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 app-card" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            <i className="bi bi-box-arrow-in-right fs-4"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in with your LearnHub credentials</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 small mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-light border-start-0 py-2"
                placeholder="name@learnhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold text-dark mb-0">Password</label>
              <Link to="/forgot-password" className="text-primary small text-decoration-none">
                Forgot password?
              </Link>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-key"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0 py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 fw-semibold rounded-pill shadow-sm mb-4"
          >
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</span>
            ) : (
              'Sign In to LearnHub'
            )}
          </button>
          {loading && (
            <p className="text-muted small text-center mt-n3 mb-3">
              <i className="bi bi-cloud-arrow-up me-1"></i>Connecting to server... (may take ~30s if cloud service is waking up)
            </p>
          )}
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="p-3 bg-light rounded-3 border mb-4">
          <div className="small fw-bold text-dark mb-2 text-center">
            <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Demo Access:
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill fw-medium"
              onClick={() => fillDemo('student@learnhub.com', 'Student@123')}
            >
              Student
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill fw-medium"
              onClick={() => fillDemo('instructor@learnhub.com', 'Instructor@123')}
            >
              Instructor
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill fw-medium"
              onClick={() => fillDemo('admin@learnhub.com', 'Admin@123')}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-primary fw-semibold text-decoration-none">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
