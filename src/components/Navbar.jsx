import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'INSTRUCTOR') return '/instructor';
    return '/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 px-3 shadow-sm">
      <div className="container-fluid max-w-7xl">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-primary" to="/">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            }}
          >
            <i className="bi bi-mortarboard-fill fs-5"></i>
          </div>
          <span style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Learn<span className="text-primary">Hub</span></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium px-3" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium px-3" to="/courses">
                Explore Courses
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link text-primary fw-semibold px-3" to={getDashboardLink()}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="dropdown position-relative" ref={dropdownRef}>
                  <button
                    className="btn btn-light d-flex align-items-center gap-2 px-3 py-1.5 border rounded-pill shadow-sm dropdown-toggle"
                    type="button"
                    id="userMenuButton"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-expanded={dropdownOpen}
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-start d-none d-sm-block">
                      <div className="fw-bold text-dark lh-1" style={{ fontSize: '0.875rem' }}>
                        {user?.name}
                      </div>
                      <span
                        className="badge mt-1"
                        style={{
                          fontSize: '0.65rem',
                          backgroundColor:
                            user?.role === 'ADMIN'
                              ? '#fee2e2'
                              : user?.role === 'INSTRUCTOR'
                              ? '#fef3c7'
                              : '#eff6ff',
                          color:
                            user?.role === 'ADMIN'
                              ? '#dc2626'
                              : user?.role === 'INSTRUCTOR'
                              ? '#d97706'
                              : '#2563eb',
                        }}
                      >
                        {user?.role}
                      </span>
                    </div>
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2 ${
                      dropdownOpen ? 'show' : ''
                    }`}
                    style={{ minWidth: '220px', right: 0 }}
                  >
                    <li>
                      <h6 className="dropdown-header text-muted">Account Menu</h6>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item rounded-3 py-2"
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <i className="bi bi-speedometer2 me-2 text-primary"></i> Main Dashboard
                      </Link>
                    </li>
                    {user?.role === 'STUDENT' && (
                      <>
                        <li>
                          <Link
                            className="dropdown-item rounded-3 py-2"
                            to="/my-courses"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-journal-bookmark me-2 text-primary"></i> My Courses
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item rounded-3 py-2"
                            to="/my-grades"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-award me-2 text-primary"></i> My Grades
                          </Link>
                        </li>
                      </>
                    )}
                    {user?.role === 'INSTRUCTOR' && (
                      <>
                        <li>
                          <Link
                            className="dropdown-item rounded-3 py-2"
                            to="/manage-courses"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-folder-check me-2 text-primary"></i> My Courses
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item rounded-3 py-2"
                            to="/create-course"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-plus-circle me-2 text-primary"></i> Create Course
                          </Link>
                        </li>
                      </>
                    )}
                    {user?.role === 'ADMIN' && (
                      <>
                        <li>
                          <Link
                            className="dropdown-item rounded-3 py-2"
                            to="/manage-users"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-people me-2 text-primary"></i> Manage Users
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item rounded-3 py-2"
                            to="/manage-courses"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-grid me-2 text-primary"></i> Manage Courses
                          </Link>
                        </li>
                      </>
                    )}
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li>
                      <button className="dropdown-item rounded-3 py-2 text-danger fw-semibold" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1.5 d-none d-md-inline-flex align-items-center gap-1"
                  title="Sign Out"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="small">Logout</span>
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary fw-semibold px-3 py-2 rounded-pill">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary fw-semibold px-3 py-2 rounded-pill shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
