import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { adminService } from '../services/adminService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageCourses = () => {
  const { user, addToast } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await adminService.getAllCoursesAdmin({ page: 0, size: 50 })
        : await courseService.getInstructorCourses({ page: 0, size: 50 });
      setCourses(data.content || []);
    } catch (err) {
      console.error('Failed to load courses for management', err);
      addToast('Failed to load course list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [isAdmin]);

  const handleTogglePublish = async (courseId) => {
    try {
      const updated = await courseService.togglePublish(courseId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, published: updated.published } : c))
      );
      addToast(
        `Course ${updated.published ? 'published' : 'unpublished'} successfully!`,
        'success'
      );
    } catch (err) {
      addToast('Failed to update publication status.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await courseService.deleteCourse(courseToDelete.id);
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
      addToast('Course deleted permanently.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete course.', 'error');
    } finally {
      setCourseToDelete(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            {isAdmin ? 'Platform Course Oversight' : 'My Courses Management'}
          </h2>
          <p className="text-muted small mb-0">
            {isAdmin ? 'Manage platform-wide courses and publications' : 'Manage your curricula, lessons, and assignments'}
          </p>
        </div>

        <Link to="/create-course" className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm">
          <i className="bi bi-plus-circle me-1"></i> Create New Course
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading courses..." />
      ) : courses.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
          <i className="bi bi-folder-x fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">No courses found</h5>
          <p className="text-muted small mb-3">Get started by creating your first course.</p>
          <Link to="/create-course" className="btn btn-primary fw-semibold rounded-pill px-4 shadow-sm">
            Create Course
          </Link>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Level</th>
                  {isAdmin && <th className="py-3">Instructor</th>}
                  <th className="py-3">Lessons</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={course.thumbnailPath ? fileService.getFileUrl(course.thumbnailPath) : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                          alt={course.title}
                          className="rounded-3 object-fit-cover"
                          style={{ width: '48px', height: '48px' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{course.title}</div>
                          <div className="small text-muted">{course.duration || 'Self-paced'}</div>
                        </div>
                      </div>
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
                    {isAdmin && (
                      <td className="small text-muted">
                        {course.instructor?.name || 'Instructor'}
                      </td>
                    )}
                    <td className="small text-muted">
                      {course.totalLessons || 0}
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
                          title="Manage Curriculum Lessons"
                        >
                          <i className="bi bi-collection-play me-1"></i> Lessons
                        </Link>
                        <Link
                          to={`/courses/${course.id}/manage-assignments`}
                          className="btn btn-sm btn-outline-info rounded-pill px-2 text-dark"
                          title="Manage Assignments"
                        >
                          <i className="bi bi-journal-text me-1"></i> Tasks
                        </Link>
                        <Link
                          to={`/courses/${course.id}/edit`}
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                          title="Edit Course Metadata"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-2"
                          title="Delete Course"
                          onClick={() => setCourseToDelete(course)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!courseToDelete}
        title="Delete Course"
        message={`Are you sure you want to permanently delete "${courseToDelete?.title}"? All associated modules, lessons, and assignments will be removed.`}
        confirmText="Delete Permanently"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
};

export default ManageCourses;
