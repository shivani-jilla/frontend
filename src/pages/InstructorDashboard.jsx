import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const InstructorDashboard = () => {
  const { user, addToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const [courseData, statsData] = await Promise.all([
          courseService.getInstructorCourses({ page: 0, size: 20 }),
          adminService.getInstructorStats(),
        ]);
        setCourses(courseData.content || []);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load instructor dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorData();
  }, []);

  const handleTogglePublish = async (courseId) => {
    try {
      const updated = await courseService.togglePublish(courseId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, published: updated.published } : c))
      );
      addToast(
        `Course ${updated.published ? 'published to public catalog' : 'unpublished from public catalog'}.`,
        'success'
      );
    } catch (err) {
      addToast('Failed to toggle course publication status.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading instructor portal..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div
        className="rounded-4 p-4 p-md-5 text-white shadow-sm position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}
      >
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-1 mb-3">
              <i className="bi bi-easel-fill me-1"></i> Instructor Control Center
            </span>
            <h2 className="display-6 fw-bold mb-2">Welcome, {user?.name}</h2>
            <p className="lead text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
              Manage your course modules, build video curricula, evaluate assignments, and track student outcomes.
            </p>
          </div>
          <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
            <Link to="/create-course" className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow">
              <i className="bi bi-plus-circle me-1"></i> Create New Course
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">My Courses</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.instructorCourses || courses.length}</h3>
            </div>
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-collection-play-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Submissions Received</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalSubmissions || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <i className="bi bi-inbox-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Pending Grading</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.pendingGradingCount || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Status</div>
              <h3 className="fw-bold text-success mb-0">Active</h3>
            </div>
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Course Management Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold text-dark mb-0">My Teaching Courses</h5>
            <small className="text-muted">Courses created and managed by you</small>
          </div>
          <Link to="/create-course" className="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3">
            <i className="bi bi-plus-lg me-1"></i> Add Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-folder2-open fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-dark">No courses created yet</h5>
            <p className="text-muted small mb-3">Begin by publishing your first educational curriculum.</p>
            <Link to="/create-course" className="btn btn-primary fw-semibold rounded-pill px-4 shadow-sm">
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Difficulty</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 px-4 text-end">Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="py-3 px-4">
                      <div className="fw-bold text-dark">{course.title}</div>
                      <div className="text-muted small">{course.duration || 'Self-paced'} &bull; {course.totalLessons || 0} lessons</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border small">
                        {course.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-primary border small">
                        {course.difficulty}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm rounded-pill fw-semibold px-3 ${
                          course.published ? 'btn-success bg-opacity-75' : 'btn-outline-secondary'
                        }`}
                        onClick={() => handleTogglePublish(course.id)}
                      >
                        {course.published ? (
                          <span><i className="bi bi-globe me-1"></i> Published</span>
                        ) : (
                          <span><i className="bi bi-eye-slash me-1"></i> Draft</span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          to={`/courses/${course.id}/manage-lessons`}
                          className="btn btn-sm btn-outline-primary rounded-pill px-2"
                          title="Manage Curriculum & Lessons"
                        >
                          <i className="bi bi-collection-play me-1"></i> Lessons
                        </Link>
                        <Link
                          to={`/courses/${course.id}/manage-assignments`}
                          className="btn btn-sm btn-outline-info rounded-pill px-2 text-dark"
                          title="Manage Course Assignments"
                        >
                          <i className="bi bi-journal-check me-1"></i> Assignments
                        </Link>
                        <Link
                          to={`/courses/${course.id}/edit`}
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                          title="Edit Course Details"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
