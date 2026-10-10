import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar-container py-3 d-none d-md-flex">
      <div className="px-3 mb-3">
        <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
          {user?.role} Portal
        </span>
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        {user?.role === 'STUDENT' && (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-grid-1x2-fill"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/my-courses"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-journal-richtext"></i>
              <span>My Enrolled Courses</span>
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-compass"></i>
              <span>Browse Catalog</span>
            </NavLink>

            <NavLink
              to="/my-grades"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-award-fill"></i>
              <span>Grades & Feedback</span>
            </NavLink>
          </>
        )}

        {user?.role === 'INSTRUCTOR' && (
          <>
            <NavLink
              to="/instructor"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/manage-courses"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-folder2-open"></i>
              <span>Manage Courses</span>
            </NavLink>

            <NavLink
              to="/create-course"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Create Course</span>
            </NavLink>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-shield-check"></i>
              <span>Admin Dashboard</span>
            </NavLink>

            <NavLink
              to="/manage-users"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-people-fill"></i>
              <span>Manage Users</span>
            </NavLink>

            <NavLink
              to="/manage-courses"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-collection-play-fill"></i>
              <span>Manage Courses</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User profile banner at bottom of sidebar */}
      <div className="p-3 mt-auto border-top mx-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '36px', height: '36px' }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="fw-semibold text-truncate small text-dark">{user?.name}</div>
            <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
