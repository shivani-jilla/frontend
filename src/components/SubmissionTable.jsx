import React from 'react';
import { Link } from 'react-router-dom';
import { fileService } from '../services/fileService';

const SubmissionTable = ({ submissions = [], onOpenGradeModal }) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-4 border border-dashed my-3">
        <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
        <h6 className="fw-bold text-dark">No student submissions received yet</h6>
        <p className="text-muted small">Submissions from enrolled students will appear here.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'GRADED':
        return <span className="badge-custom badge-status-graded"><i className="bi bi-check-all"></i> Graded</span>;
      case 'LATE':
        return <span className="badge-custom badge-status-late"><i className="bi bi-clock-history"></i> Late</span>;
      case 'SUBMITTED':
      default:
        return <span className="badge-custom badge-status-submitted"><i className="bi bi-inbox"></i> Needs Grading</span>;
    }
  };

  return (
    <div className="table-responsive bg-white rounded-4 shadow-sm border overflow-hidden">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="py-3 px-4">Student</th>
            <th className="py-3">Submitted At</th>
            <th className="py-3">Submission Type</th>
            <th className="py-3">Status</th>
            <th className="py-3">Score</th>
            <th className="py-3 px-4 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td className="py-3 px-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '36px', height: '36px' }}
                  >
                    {sub.student?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="fw-bold text-dark">{sub.student?.name}</div>
                    <div className="small text-muted">{sub.student?.email}</div>
                  </div>
                </div>
              </td>
              <td className="small text-muted">
                {sub.submittedAt
                  ? new Date(sub.submittedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  {sub.textResponse && (
                    <span className="badge bg-light text-dark border small" title="Contains text response">
                      <i className="bi bi-file-text me-1"></i> Text
                    </span>
                  )}
                  {sub.filePath && (
                    <a
                      href={fileService.getFileUrl(sub.filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="badge bg-primary-subtle text-primary text-decoration-none border border-primary-subtle small"
                      title={sub.fileName || 'Attachment'}
                    >
                      <i className="bi bi-paperclip me-1"></i> File
                    </a>
                  )}
                </div>
              </td>
              <td>{getStatusBadge(sub.status)}</td>
              <td>
                {sub.marksAwarded != null ? (
                  <span className="fw-bold text-success">
                    {sub.marksAwarded} / {sub.maxMarks} ({sub.percentage}%)
                  </span>
                ) : (
                  <span className="text-muted small">&mdash;</span>
                )}
              </td>
              <td className="py-3 px-4 text-end">
                <button
                  className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm"
                  onClick={() => onOpenGradeModal(sub)}
                >
                  <i className="bi bi-pencil-square me-1"></i>
                  {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Submission'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionTable;
