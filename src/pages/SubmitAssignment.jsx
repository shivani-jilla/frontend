import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { submissionService } from '../services/submissionService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SubmitAssignment = () => {
  const { id } = useParams();
  const { addToast } = useAuth();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [textResponse, setTextResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignmentAndSubmission = async () => {
      try {
        const assignmentData = await assignmentService.getAssignmentById(id);
        setAssignment(assignmentData);

        try {
          const subData = await submissionService.getMySubmission(id);
          setExistingSubmission(subData);
          if (subData.textResponse) {
            setTextResponse(subData.textResponse);
          }
        } catch {
          // No prior submission
        }
      } catch (err) {
        console.error('Failed to load assignment', err);
        setError('Failed to load assignment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentAndSubmission();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignment) return;

    // Validation
    const type = assignment.allowedSubmissionType;
    const hasText = textResponse.trim().length > 0;
    const hasExistingFile = existingSubmission && existingSubmission.filePath;
    const hasNewFile = selectedFile !== null;

    if (type === 'TEXT' && !hasText) {
      setError('Please provide a text response.');
      return;
    }
    if (type === 'FILE' && !hasNewFile && !hasExistingFile) {
      setError('Please upload a submission file.');
      return;
    }
    if (type === 'BOTH' && !hasText && !hasNewFile && !hasExistingFile) {
      setError('Please enter a text response or choose a file.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      let uploadedFilePath = existingSubmission?.filePath || null;
      let uploadedFileName = existingSubmission?.fileName || null;

      // Upload file locally if selected
      if (selectedFile) {
        const fileResult = await fileService.uploadFile(selectedFile, 'submissions');
        uploadedFilePath = fileResult.filePath;
        uploadedFileName = fileResult.fileName;
      }

      const submissionPayload = {
        textResponse: textResponse.trim() || null,
        filePath: uploadedFilePath,
        fileName: uploadedFileName,
      };

      const result = await submissionService.submitAssignment(assignment.id, submissionPayload);
      setExistingSubmission(result);
      addToast(
        result.status === 'LATE'
          ? 'Assignment submitted (Recorded as late).'
          : 'Assignment submitted successfully!',
        'success'
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please check deadline and inputs.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assignment details..." />;
  }

  if (!assignment) {
    return (
      <div className="container py-5 text-center">
        <h4>Assignment not found</h4>
        <Link to="/my-courses" className="btn btn-primary mt-3">Back to Courses</Link>
      </div>
    );
  }

  const isPastDue = assignment.isPastDue;
  const isGraded = existingSubmission?.status === 'GRADED';

  return (
    <div className="container py-5" style={{ maxWidth: '840px' }}>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to={`/courses/${assignment.courseId}/assignments`} className="text-decoration-none">Assignments</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{assignment.title}</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-3 border-bottom mb-4">
          <div>
            <span className="badge bg-light text-primary border small rounded-pill px-3 py-1 mb-2">
              Max: {assignment.maxMarks} Marks
            </span>
            <h2 className="fw-bold text-dark mb-1">{assignment.title}</h2>
            <div className="text-muted small">
              Course: <strong className="text-secondary">{assignment.courseTitle}</strong>
            </div>
          </div>

          <div className="text-md-end">
            <div className="small text-muted mb-1">
              Due Date:
            </div>
            <div className={`fw-bold ${isPastDue ? 'text-danger' : 'text-dark'}`}>
              <i className="bi bi-calendar-event me-1"></i>
              {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No date'}
            </div>
            {isPastDue && (
              <span className="badge bg-danger-subtle text-danger small mt-1">
                {assignment.allowLateSubmissions ? 'Late submissions accepted' : 'Deadline passed'}
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-2">Instructions</h5>
          <div className="p-3 bg-light rounded-3 text-muted lh-lg" style={{ whiteSpace: 'pre-line' }}>
            {assignment.instructions || assignment.description}
          </div>
        </div>

        {/* Supplementary Attachment */}
        {assignment.attachmentPath && (
          <div className="mb-4 p-3 bg-primary-subtle rounded-3 border border-primary-subtle d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-paperclip fs-5 text-primary"></i>
              <span className="fw-medium small text-dark">Supplementary Assignment Resource</span>
            </div>
            <a
              href={fileService.getFileUrl(assignment.attachmentPath)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold"
            >
              <i className="bi bi-download me-1"></i> Download
            </a>
          </div>
        )}

        {/* Current Submission / Grade Status Banner */}
        {existingSubmission && (
          <div className={`alert ${isGraded ? 'alert-success' : 'alert-primary'} p-4 rounded-4 mb-4 shadow-sm`}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="alert-heading fw-bold mb-0">
                <i className={`bi ${isGraded ? 'bi-check-all text-success' : 'bi-check-circle text-primary'} me-2`}></i>
                {isGraded ? 'Evaluated Submission' : 'Submission Submitted'}
              </h5>
              <span className="badge bg-white text-dark border px-2 py-1 small">
                Status: {existingSubmission.status}
              </span>
            </div>

            <div className="small text-muted mb-2">
              Submitted at: {new Date(existingSubmission.submittedAt).toLocaleString()}
            </div>

            {isGraded && (
              <div className="mt-3 p-3 bg-white rounded-3 border">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold text-dark">Awarded Marks:</span>
                  <span className="fs-5 fw-bold text-success">
                    {existingSubmission.marksAwarded} / {assignment.maxMarks} ({existingSubmission.percentage}%)
                  </span>
                </div>
                {existingSubmission.feedback && (
                  <div>
                    <div className="small fw-semibold text-muted mb-1">Feedback:</div>
                    <div className="small fst-italic text-dark">"{existingSubmission.feedback}"</div>
                  </div>
                )}
              </div>
            )}

            {existingSubmission.filePath && (
              <div className="mt-2 small">
                <a
                  href={fileService.getFileUrl(existingSubmission.filePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="fw-semibold text-decoration-none"
                >
                  <i className="bi bi-file-earmark-arrow-down me-1"></i> View Submitted File ({existingSubmission.fileName || 'Attachment'})
                </a>
              </div>
            )}
          </div>
        )}

        {/* Submission Form */}
        {!isGraded ? (
          <form onSubmit={handleSubmit}>
            <h5 className="fw-bold text-dark mb-3">
              {existingSubmission ? 'Update Your Submission' : 'Submit Your Work'}
            </h5>

            {error && (
              <div className="alert alert-danger small p-3 rounded-3 mb-3">
                <i className="bi bi-exclamation-octagon-fill me-1"></i> {error}
              </div>
            )}

            {(assignment.allowedSubmissionType === 'TEXT' || assignment.allowedSubmissionType === 'BOTH') && (
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">
                  Text Response / Repository Link
                </label>
                <textarea
                  className="form-control bg-light"
                  rows="6"
                  placeholder="Type your response, code snippet, or paste your project GitHub URL..."
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                ></textarea>
              </div>
            )}

            {(assignment.allowedSubmissionType === 'FILE' || assignment.allowedSubmissionType === 'BOTH') && (
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">
                  Upload Deliverable File (ZIP, PDF, DOCX, TXT)
                </label>
                <input
                  type="file"
                  className="form-control bg-light"
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                />
                {selectedFile && (
                  <div className="small text-muted mt-1">
                    Selected file: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
            >
              {submitting ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Uploading & Saving...</span>
              ) : existingSubmission ? (
                'Save Changes & Resubmit'
              ) : (
                'Submit Assignment'
              )}
            </button>
          </form>
        ) : (
          <div className="alert alert-light border small text-muted">
            <i className="bi bi-info-circle me-1"></i> This assignment has been finalized and graded. Resubmission is disabled.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitAssignment;
