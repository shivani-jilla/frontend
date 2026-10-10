import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { submissionService } from '../services/submissionService';
import { gradeService } from '../services/gradeService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import SubmissionTable from '../components/SubmissionTable';
import LoadingSpinner from '../components/LoadingSpinner';

const ViewSubmissions = () => {
  const { id } = useParams();
  const { addToast } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grading Modal State
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [marksInput, setMarksInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);
  const [gradeError, setGradeError] = useState('');

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const [assignmentData, subsData] = await Promise.all([
        assignmentService.getAssignmentById(id),
        submissionService.getSubmissionsByAssignment(id),
      ]);
      setAssignment(assignmentData);
      setSubmissions(subsData || []);
    } catch (err) {
      console.error('Failed to load submissions', err);
      addToast('Failed to load assignment submissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [id]);

  const handleOpenGradeModal = (sub) => {
    setActiveSubmission(sub);
    setMarksInput(sub.marksAwarded != null ? sub.marksAwarded.toString() : '');
    setFeedbackInput(sub.feedback || '');
    setGradeError('');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!activeSubmission || !assignment) return;

    const numMarks = parseFloat(marksInput);
    if (isNaN(numMarks)) {
      setGradeError('Please enter a valid numeric score.');
      return;
    }
    if (numMarks < 0) {
      setGradeError('Marks cannot be negative.');
      return;
    }
    if (numMarks > Number(assignment.maxMarks)) {
      setGradeError(`Marks cannot exceed assignment maximum (${assignment.maxMarks}).`);
      return;
    }

    try {
      setSavingGrade(true);
      setGradeError('');

      const graded = await gradeService.gradeSubmission(activeSubmission.id, {
        marksAwarded: numMarks,
        feedback: feedbackInput.trim(),
      });

      setSubmissions((prev) =>
        prev.map((s) => (s.id === graded.id ? graded : s))
      );

      addToast(`Grade saved for ${activeSubmission.student?.name}!`, 'success');
      setActiveSubmission(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit grade.';
      setGradeError(msg);
    } finally {
      setSavingGrade(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading student submissions..." />;
  }

  const gradedCount = submissions.filter((s) => s.status === 'GRADED').length;
  const pendingCount = submissions.length - gradedCount;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/manage-courses" className="text-decoration-none">Manage Courses</Link></li>
          <li className="breadcrumb-item"><Link to={`/courses/${assignment?.courseId}/manage-assignments`} className="text-decoration-none">Assignments</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Submissions</li>
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Submissions Review & Grading</h2>
          <p className="text-muted small mb-0">
            {assignment?.title} &bull; Course: <strong>{assignment?.courseTitle}</strong> &bull; Max: <strong>{assignment?.maxMarks} Marks</strong>
          </p>
        </div>

        <div className="d-flex gap-2">
          <span className="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill">
            {gradedCount} Graded
          </span>
          <span className="badge bg-warning-subtle text-warning fs-6 px-3 py-2 rounded-pill">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      <SubmissionTable
        submissions={submissions}
        onOpenGradeModal={handleOpenGradeModal}
      />

      {/* Grading Modal */}
      {activeSubmission && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSaveGrade}>
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-1">
                      Grade Student Submission
                    </h5>
                    <div className="text-muted small">
                      Student: <strong>{activeSubmission.student?.name}</strong> ({activeSubmission.student?.email})
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setActiveSubmission(null)}></button>
                </div>

                <div className="modal-body p-4">
                  {/* Submitted Content Review */}
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <h6 className="fw-bold text-dark small mb-2">Student Response:</h6>
                    {activeSubmission.textResponse ? (
                      <div className="small text-dark p-2 bg-white rounded border mb-2" style={{ whiteSpace: 'pre-line' }}>
                        {activeSubmission.textResponse}
                      </div>
                    ) : (
                      <div className="small text-muted mb-2 fst-italic">No text response provided.</div>
                    )}

                    {activeSubmission.filePath && (
                      <div className="mt-2">
                        <a
                          href={fileService.getFileUrl(activeSubmission.filePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary fw-medium rounded-pill"
                        >
                          <i className="bi bi-download me-1"></i> Download Deliverable ({activeSubmission.fileName || 'Attachment'})
                        </a>
                      </div>
                    )}
                  </div>

                  {gradeError && (
                    <div className="alert alert-danger small p-3 rounded-3 mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i> {gradeError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Marks Awarded (out of {assignment?.maxMarks}) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={assignment?.maxMarks}
                      className="form-control bg-light"
                      placeholder="e.g. 92.5"
                      value={marksInput}
                      onChange={(e) => setMarksInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Written Feedback & Comments
                    </label>
                    <textarea
                      className="form-control bg-light"
                      rows="4"
                      placeholder="Constructive feedback, code review notes, or evaluation remarks..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 pb-4 px-4">
                  <button type="button" className="btn btn-light" onClick={() => setActiveSubmission(null)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={savingGrade} className="btn btn-primary fw-bold px-4 rounded-pill">
                    {savingGrade ? 'Submitting Grade...' : 'Save & Publish Grade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;
