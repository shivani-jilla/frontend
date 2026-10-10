import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import AssignmentCard from '../components/AssignmentCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AssignmentList = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const [courseData, assignmentData] = await Promise.all([
          courseService.getCourseDetails(id),
          assignmentService.getAssignmentsByCourse(id),
        ]);
        setCourse(courseData);
        setAssignments(assignmentData || []);
      } catch (err) {
        console.error('Failed to load course assignments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading course assignments..." />;
  }

  const isInstructorOrAdmin = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/my-courses" className="text-decoration-none">My Courses</Link></li>
          <li className="breadcrumb-item"><Link to={`/courses/${id}/learn`} className="text-decoration-none">{course?.title}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Assignments</li>
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Course Assignments</h2>
          <p className="text-muted small mb-0">
            {course?.title} &bull; {assignments.length} total assignments
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to={`/courses/${id}/learn`} className="btn btn-outline-primary fw-semibold rounded-pill px-3">
            <i className="bi bi-play-circle me-1"></i> Back to Lessons
          </Link>
          {isInstructorOrAdmin && (
            <Link to={`/courses/${id}/manage-assignments`} className="btn btn-primary fw-semibold rounded-pill px-3 shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Add Assignment
            </Link>
          )}
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
          <i className="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">No assignments posted for this course yet</h5>
          <p className="text-muted small mb-3">Your instructor has not published any assignments for this course.</p>
          <Link to={`/courses/${id}/learn`} className="btn btn-primary fw-semibold rounded-pill px-4">
            Return to Video Lessons
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {assignments.map((assignment) => (
            <div className="col" key={assignment.id}>
              <AssignmentCard assignment={assignment} userRole={user?.role} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
