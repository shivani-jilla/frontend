import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getPublishedCourses({ page: 0, size: 3 });
        setFeaturedCourses(data.content || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="d-flex flex-column gap-5 pb-5">
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%)',
          borderRadius: '0 0 2rem 2rem',
        }}
      >
        <div className="container py-5 my-3 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-4">
                <i className="bi bi-stars text-warning"></i>
                <span className="small fw-semibold text-white">The Next Generation Learning Management System</span>
              </div>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: '1.15' }}>
                Transform Your Future with <span className="text-info">LearnHub</span>
              </h1>
              <p className="lead text-white-50 mb-4" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                Join an interactive academic platform where students excel, instructors inspire, and real-world skills come to life through guided video lessons, hands-on assignments, and structured feedback.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/courses" className="btn btn-info fw-bold px-4 py-3 rounded-pill shadow-lg text-dark">
                  <i className="bi bi-compass me-2"></i> Browse All Courses
                </Link>
                <Link to="/register" className="btn btn-outline-light fw-bold px-4 py-3 rounded-pill">
                  Join Free Today
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="row mt-5 pt-4 border-top border-white border-opacity-10 g-4">
                <div className="col-4">
                  <h3 className="fw-bold text-white mb-0">100%</h3>
                  <small className="text-white-50">Local & Self-Contained</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-white mb-0">Spring 6</h3>
                  <small className="text-white-50">JWT Protected API</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-white mb-0">MySQL</h3>
                  <small className="text-white-50">Relational Database</small>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Students learning together"
                  className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20"
                  style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
                <div
                  className="position-absolute bottom-0 start-0 m-3 p-3 bg-white text-dark rounded-3 shadow-lg text-start"
                  style={{ maxWidth: '240px' }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-success rounded-circle p-1"></span>
                    <strong className="small">Active Learning</strong>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Track lesson completion, submit files, and review verified grades.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="container">
        <div className="text-center mb-4">
          <span className="text-uppercase text-primary fw-bold small">Explore Domains</span>
          <h2 className="fw-bold text-dark">Top Learning Categories</h2>
        </div>
        <div className="row g-3 justify-content-center">
          {[
            { name: 'Web Development', icon: 'bi-code-slash', color: '#2563eb' },
            { name: 'Computer Science', icon: 'bi-cpu', color: '#7c3aed' },
            { name: 'Data Science', icon: 'bi-graph-up-arrow', color: '#059669' },
            { name: 'Cloud Computing', icon: 'bi-cloud-check', color: '#0284c7' },
          ].map((cat, idx) => (
            <div className="col-6 col-md-3" key={idx}>
              <Link
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-dark app-card text-center h-100"
              >
                <div
                  className="rounded-3 d-inline-flex align-items-center justify-content-center mx-auto mb-2 text-white"
                  style={{ width: '48px', height: '48px', backgroundColor: cat.color }}
                >
                  <i className={`bi ${cat.icon} fs-4`}></i>
                </div>
                <h6 className="fw-bold mb-0">{cat.name}</h6>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-uppercase text-primary fw-bold small">Curated Catalog</span>
            <h2 className="fw-bold text-dark mb-0">Featured Courses</h2>
          </div>
          <Link to="/courses" className="btn btn-outline-primary fw-semibold rounded-pill px-4">
            View All Courses <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading courses..." />
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {featuredCourses.map((course) => (
              <div className="col" key={course.id}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Platform Features Grid */}
      <section className="container py-4">
        <div className="text-center mb-5">
          <span className="text-uppercase text-primary fw-bold small">Platform Advantages</span>
          <h2 className="fw-bold text-dark">Why Learn & Teach on LearnHub?</h2>
        </div>
        <div className="row g-4">
          {[
            {
              title: 'Interactive Video Lessons',
              description: 'Watch step-by-step video lessons, resume seamlessly from where you stopped, and mark modules completed.',
              icon: 'bi-play-circle-fill',
              color: '#2563eb',
            },
            {
              title: 'Practical Assignments',
              description: 'Submit answers as rich text or upload deliverables locally. Automatic late submission tracking and deadline controls.',
              icon: 'bi-clipboard-check-fill',
              color: '#10b981',
            },
            {
              title: 'Transparent Gradebook',
              description: 'Instructors review student work with detailed marks and written constructive feedback saved securely in MySQL.',
              icon: 'bi-award-fill',
              color: '#f59e0b',
            },
            {
              title: 'Role-Based Access Control',
              description: 'Dedicated portals for Students, Instructors, and Administrators enforced on the Spring Security backend.',
              icon: 'bi-shield-check',
              color: '#6366f1',
            },
          ].map((feature, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={idx}>
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 app-card">
                <div
                  className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3 text-white"
                  style={{ width: '48px', height: '48px', backgroundColor: feature.color }}
                >
                  <i className={`bi ${feature.icon} fs-4`}></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">{feature.title}</h5>
                <p className="text-muted small mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="container my-4">
        <div
          className="rounded-4 p-5 text-white text-center shadow-lg position-relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}
        >
          <h2 className="display-6 fw-bold mb-3">Ready to Advance Your Skills?</h2>
          <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Get started today with LearnHub. Explore courses, complete assignments, and track your verified academic achievements.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light text-primary fw-bold px-4 py-3 rounded-pill shadow">
              Create Free Account
            </Link>
            <Link to="/courses" className="btn btn-outline-light fw-bold px-4 py-3 rounded-pill">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
