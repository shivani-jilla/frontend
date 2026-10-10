import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="p-4 p-md-5 bg-white">
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                  >
                    <i className="bi bi-key-fill"></i>
                  </div>
                  <h3 className="fw-bold text-dark">Reset Password</h3>
                  <p className="text-muted small">
                    Self-contained LMS account recovery guide
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center">
                    <div className="alert alert-info border-0 rounded-4 p-3 mb-4 text-start">
                      <div className="fw-bold mb-1">
                        <i className="bi bi-info-circle-fill me-1"></i> Standalone Environment Notice
                      </div>
                      <div className="small">
                        In accordance with local self-contained architecture guidelines (no external SMTP / cloud mail services), password resets are managed directly by platform administrators.
                      </div>
                      <div className="small mt-2">
                        For demo access, you can sign in directly using the seeded demo accounts or ask an admin to reset credentials in the Admin Directory.
                      </div>
                    </div>
                    <Link to="/login" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                      Return to Sign In
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Registered Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold shadow-sm mb-3">
                      Request Password Reset
                    </button>
                    <div className="text-center">
                      <Link to="/login" className="text-decoration-none small text-muted">
                        <i className="bi bi-arrow-left me-1"></i> Back to Login
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
