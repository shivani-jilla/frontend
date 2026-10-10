import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (data.user.role === 'INSTRUCTOR') {
        navigate('/instructor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 app-card" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <i className="bi bi-person-plus-fill fs-4"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Create an Account</h3>
          <p className="text-muted small">Join LearnHub as a student or course instructor</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 small mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 py-2"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-light border-start-0 py-2"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0 py-2"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-dark mb-2">I want to join as:</label>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="radio"
                  className="btn-check"
                  name="roleSelection"
                  id="roleStudent"
                  autoComplete="off"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                />
                <label className="btn btn-outline-primary w-100 py-2 fw-medium rounded-3 text-start d-flex align-items-center gap-2" htmlFor="roleStudent">
                  <i className="bi bi-backpack-fill text-primary"></i>
                  <div>
                    <div className="fw-bold">Student</div>
                    <div style={{ fontSize: '0.7rem' }}>Enroll & Learn</div>
                  </div>
                </label>
              </div>

              <div className="col-6">
                <input
                  type="radio"
                  className="btn-check"
                  name="roleSelection"
                  id="roleInstructor"
                  autoComplete="off"
                  checked={role === 'INSTRUCTOR'}
                  onChange={() => setRole('INSTRUCTOR')}
                />
                <label className="btn btn-outline-primary w-100 py-2 fw-medium rounded-3 text-start d-flex align-items-center gap-2" htmlFor="roleInstructor">
                  <i className="bi bi-easel-fill text-primary"></i>
                  <div>
                    <div className="fw-bold">Instructor</div>
                    <div style={{ fontSize: '0.7rem' }}>Teach & Grade</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-100 py-2 fw-semibold rounded-pill shadow-sm mb-4"
          >
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</span>
            ) : (
              'Create My LearnHub Account'
            )}
          </button>
        </form>

        <div className="text-center small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
