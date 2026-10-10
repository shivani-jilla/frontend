import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="display-1 fw-bold text-primary mb-3">404</div>
            <h2 className="fw-bold text-dark mb-3">Page Not Found</h2>
            <p className="lead text-muted mb-4">
              The page you are looking for might have been moved, removed, or does not exist on LearnHub.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                <i className="bi bi-house-door-fill me-2"></i> Back to Home
              </Link>
              <Link to="/courses" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
                <i className="bi bi-book-half me-2"></i> Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
