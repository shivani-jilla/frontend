import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await adminService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading system metrics and administrator dashboard..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Banner */}
      <div
        className="rounded-4 p-4 p-md-5 text-white shadow-sm position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #090d16, #1e293b)' }}
      >
        <span className="badge bg-danger text-white rounded-pill px-3 py-1 mb-3">
          <i className="bi bi-shield-shaded me-1"></i> Root Administration Console
        </span>
        <h2 className="display-6 fw-bold mb-2">Platform Administration</h2>
        <p className="lead text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
          Comprehensive oversight of users, courses, registrations, submissions, and platform-wide database health.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Total Registered Users</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalUsers || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Active Students</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalStudents || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <i className="bi bi-backpack-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Course Instructors</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalInstructors || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <i className="bi bi-easel-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Total Courses</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalCourses || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <i className="bi bi-collection-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Published Courses</div>
              <h3 className="fw-bold text-success mb-0">{stats?.publishedCourses || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Unpublished / Drafts</div>
              <h3 className="fw-bold text-secondary mb-0">{stats?.unpublishedCourses || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-secondary-subtle text-secondary">
              <i className="bi bi-eye-slash-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Total Course Enrollments</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalEnrollments || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-journal-check"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Assignment Submissions</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalSubmissions || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <i className="bi bi-send-check-fill"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Action Panels */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 app-card bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-person-lines-fill text-primary me-2"></i> User Directory Management
            </h5>
            <p className="text-muted small mb-4">
              View all students and instructors, assign roles, activate or deactivate accounts, or remove obsolete profiles.
            </p>
            <Link to="/manage-users" className="btn btn-outline-primary fw-semibold rounded-pill px-4 align-self-start mt-auto">
              Launch User Manager <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 app-card bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-layers-fill text-primary me-2"></i> Global Course Oversight
            </h5>
            <p className="text-muted small mb-4">
              Review platform-wide course submissions, manage publication status, and oversee course quality.
            </p>
            <Link to="/manage-courses" className="btn btn-outline-primary fw-semibold rounded-pill px-4 align-self-start mt-auto">
              Review All Courses <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
