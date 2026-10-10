import React from 'react';
import { fileService } from '../services/fileService';

const GradeCard = ({ submission }) => {
  const isGraded = submission.status === 'GRADED' && submission.marksAwarded != null;

  return (
    <div className="card border-0 shadow-sm rounded-4 app-card p-4 mb-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 border-bottom">
        <div>
          <span className="badge bg-light text-primary border rounded-pill px-3 py-1 small mb-2">
            {submission.courseTitle || 'Enrolled Course'}
          </span>
          <h5 className="fw-bold text-dark mb-1">{submission.assignmentTitle}</h5>
          <div className="text-muted small">
            Submitted on:{' '}
            {submission.submittedAt
              ? new Date(submission.submittedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A'}
          </div>
        </div>

        <div className="text-md-end">
          {isGraded ? (
            <div>
              <div className="fs-3 fw-bold text-success">
                {submission.marksAwarded} <span className="fs-6 text-muted">/ {submission.maxMarks}</span>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-semibold">
                {submission.percentage}% &bull; Graded
              </span>
            </div>
          ) : (
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill fw-semibold">
              <i className="bi bi-hourglass-split me-1"></i> Grading Pending
            </span>
          )}
        </div>
      </div>

      <div className="pt-3">
        {isGraded && submission.feedback && (
          <div className="p-3 bg-light rounded-3 mb-3 border">
            <h6 className="fw-bold text-dark small mb-1">
              <i className="bi bi-chat-left-quote-fill text-primary me-2"></i> Instructor Feedback:
            </h6>
            <p className="small text-muted mb-0 fst-italic">"{submission.feedback}"</p>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between small text-muted">
          <div>
            {submission.filePath && (
              <a
                href={fileService.getFileUrl(submission.filePath)}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-decoration-none fw-semibold"
              >
                <i className="bi bi-file-earmark-check me-1"></i> View Submitted File
              </a>
            )}
          </div>
          {submission.gradedAt && (
            <div>
              Graded on: {new Date(submission.gradedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeCard;
