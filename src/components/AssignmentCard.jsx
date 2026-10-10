import React from 'react';
import { Link } from 'react-router-dom';

const AssignmentCard = ({ assignment, userRole = 'STUDENT' }) => {
  const isPastDue = assignment.isPastDue;
  const sub = assignment.mySubmission;

  const getStatusBadge = () => {
    if (!assignment.hasSubmitted) {
      if (isPastDue) {
        return <span className="badge-custom bg-danger-subtle text-danger"><i className="bi bi-clock-history"></i> Overdue</span>;
      }
      return <span className="badge-custom bg-warning-subtle text-warning"><i className="bi bi-hourglass-split"></i> Pending</span>;
    }

    if (sub?.status === 'GRADED') {
      return (
        <span className="badge-custom badge-status-graded">
          <i className="bi bi-check-all"></i> Graded: {sub.marksAwarded} / {assignment.maxMarks} ({sub.percentage}%)
        </span>
      );
    }

    if (sub?.status === 'LATE') {
      return <span className="badge-custom badge-status-late"><i className="bi bi-exclamation-triangle"></i> Submitted Late</span>;
    }

    return <span className="badge-custom badge-status-submitted"><i className="bi bi-check-circle"></i> Submitted</span>;
  };

  const formattedDueDate = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No deadline';

  return (
    <div className="card border-0 shadow-sm rounded-4 app-card p-4 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="badge bg-light text-primary border small rounded-pill px-3 py-1">
          Max: {assignment.maxMarks} Marks
        </span>
        {userRole === 'STUDENT' && getStatusBadge()}
      </div>

      <h5 className="fw-bold text-dark mb-1">{assignment.title}</h5>
      {assignment.courseTitle && (
        <p className="text-muted small mb-2">Course: <strong className="text-secondary">{assignment.courseTitle}</strong></p>
      )}

      <p className="text-muted small mb-3 text-truncate-2 flex-grow-1">
        {assignment.description}
      </p>

      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto small text-muted">
        <div>
          <i className="bi bi-calendar-event me-1 text-primary"></i>
          <span>Due: <strong>{formattedDueDate}</strong></span>
        </div>
        <div>
          <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1">
            {assignment.allowedSubmissionType}
          </span>
        </div>
      </div>

      <div className="mt-3">
        {userRole === 'STUDENT' ? (
          <Link
            to={`/assignments/${assignment.id}/submit`}
            className={`btn ${assignment.hasSubmitted ? 'btn-outline-primary' : 'btn-primary'} w-100 fw-semibold rounded-pill py-2 shadow-sm`}
          >
            {assignment.hasSubmitted ? 'View / Edit Submission' : 'Submit Assignment'}
          </Link>
        ) : (
          <Link
            to={`/assignments/${assignment.id}/submissions`}
            className="btn btn-outline-primary w-100 fw-semibold rounded-pill py-2"
          >
            Review Submissions ({assignment.totalSubmissions || 0})
          </Link>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
