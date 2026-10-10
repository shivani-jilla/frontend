import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-auto py-5 text-muted">
      <div className="container-fluid max-w-7xl px-4">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                }}
              >
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <span className="fw-bold fs-5 text-dark">Learn<span className="text-primary">Hub</span></span>
            </div>
            <p className="small text-muted mb-3" style={{ maxWidth: '340px' }}>
              A centralized, enterprise-grade Learning Management System designed to empower students, instructors, and academic administrators.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                <i className="bi bi-check-circle-fill me-1"></i> System Online
              </span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                Spring Boot + React
              </span>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-dark mb-3">Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/courses" className="text-decoration-none text-muted hover-primary">Course Catalog</Link></li>
              <li><Link to="/courses?category=Web%20Development" className="text-decoration-none text-muted">Web Development</Link></li>
              <li><Link to="/courses?category=Computer%20Science" className="text-decoration-none text-muted">Computer Science</Link></li>
              <li><Link to="/courses?category=Data%20Science" className="text-decoration-none text-muted">Data Science</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-dark mb-3">Portals</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/dashboard" className="text-decoration-none text-muted">Student Portal</Link></li>
              <li><Link to="/instructor" className="text-decoration-none text-muted">Instructor Portal</Link></li>
              <li><Link to="/admin" className="text-decoration-none text-muted">Admin Console</Link></li>
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="text-decoration-none text-muted">API Docs (Swagger)</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-dark mb-3">Platform Security & Architecture</h6>
            <p className="small text-muted mb-2">
              Protected by Spring Security 6 with stateless BCrypt + JWT bearer authorization. Real MySQL relational database persistence.
            </p>
            <div className="d-flex align-items-center gap-3 mt-3 text-secondary">
              <i className="bi bi-shield-lock-fill fs-5 text-primary" title="BCrypt + JWT Secured"></i>
              <i className="bi bi-database-fill fs-5 text-primary" title="MySQL Relational Storage"></i>
              <i className="bi bi-cpu-fill fs-5 text-primary" title="Java 21 LTS Core"></i>
              <i className="bi bi-lightning-charge-fill fs-5 text-primary" title="Vite React Performance"></i>
            </div>
          </div>
        </div>

        <div className="border-top mt-4 pt-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small">
          <div>
            &copy; {new Date().getFullYear()} LearnHub LMS. All rights reserved. Self-contained & locally runnable.
          </div>
          <div className="text-muted">
            Version 1.0.0 &bull; Built with React & Spring Boot
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
