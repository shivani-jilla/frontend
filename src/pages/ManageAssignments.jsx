import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { assignmentService } from '../services/assignmentService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageAssignments = () => {
  const { id } = useParams();
  const { addToast } = useAuth();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    maxMarks: '100.00',
    dueDate: '',
    allowedSubmissionType: 'BOTH',
    allowLateSubmissions: true,
    published: true,
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Deletion confirm
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [courseData, assignmentsData] = await Promise.all([
        courseService.getCourseDetails(id),
        assignmentService.getAssignmentsByCourse(id),
      ]);
      setCourse(courseData);
      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error('Failed to load assignments', err);
      addToast('Failed to load assignments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleOpenModal = (assignment = null) => {
    setAttachmentFile(null);
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title,
        description: assignment.description || '',
        instructions: assignment.instructions || '',
        maxMarks: assignment.maxMarks?.toString() || '100.00',
        dueDate: assignment.dueDate ? assignment.dueDate.substring(0, 16) : '',
        allowedSubmissionType: assignment.allowedSubmissionType || 'BOTH',
        allowLateSubmissions: assignment.allowLateSubmissions !== false,
        published: assignment.published !== false,
      });
    } else {
      setEditingAssignment(null);
      // default due date: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

      setFormData({
        title: '',
        description: '',
        instructions: '',
        maxMarks: '100.00',
        dueDate: isoLocal,
        allowedSubmissionType: 'BOTH',
        allowLateSubmissions: true,
        published: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;

    try {
      setSaving(true);
      let attachmentPath = editingAssignment?.attachmentPath || null;

      if (attachmentFile) {
        const uploadResult = await fileService.uploadFile(attachmentFile, 'templates');
        attachmentPath = uploadResult.filePath;
      }

      const payload = {
        ...formData,
        maxMarks: parseFloat(formData.maxMarks),
        attachmentPath,
      };

      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment.id, payload);
        addToast('Assignment updated successfully.', 'success');
      } else {
        await assignmentService.createAssignment(course.id, payload);
        addToast('Assignment created successfully.', 'success');
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save assignment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assignmentToDelete) return;
    try {
      await assignmentService.deleteAssignment(assignmentToDelete.id);
      addToast('Assignment deleted.', 'info');
      loadData();
    } catch (err) {
      addToast('Failed to delete assignment.', 'error');
    } finally {
      setAssignmentToDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course assignments..." />;
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/manage-courses" className="text-decoration-none">Manage Courses</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{course?.title} - Assignments</li>
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Course Assignments & Tasks</h2>
          <p className="text-muted small mb-0">{course?.title} &bull; Manage student assignments</p>
        </div>

        <button
          className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm"
          onClick={() => handleOpenModal()}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
          <i className="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">No assignments added yet</h5>
          <p className="text-muted small mb-3">Create assignments with deadlines, scoring rubrics, and allowed submission formats.</p>
          <button
            className="btn btn-primary fw-semibold rounded-pill px-4"
            onClick={() => handleOpenModal()}
          >
            Create Assignment
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3">Max Marks</th>
                  <th className="py-3">Due Date</th>
                  <th className="py-3">Format</th>
                  <th className="py-3">Submissions</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 px-4">
                      <div className="fw-bold text-dark">{a.title}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '320px' }}>
                        {a.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-primary border small">
                        {a.maxMarks} Marks
                      </span>
                    </td>
                    <td className="small text-muted">
                      {a.dueDate ? new Date(a.dueDate).toLocaleString() : 'No date'}
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary small rounded-pill">
                        {a.allowedSubmissionType}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/assignments/${a.id}/submissions`}
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                      >
                        <i className="bi bi-inbox me-1"></i> Review ({a.totalSubmissions || 0})
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-light border rounded-pill px-2"
                          title="Edit Assignment"
                          onClick={() => handleOpenModal(a)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger rounded-pill px-2"
                          title="Delete Assignment"
                          onClick={() => setAssignmentToDelete(a)}
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

      {/* Assignment Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSave}>
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold text-dark">
                    {editingAssignment ? 'Edit Assignment' : 'Create Course Assignment'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Assignment Title *</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. Project 1: Database Normalization"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-dark">Maximum Marks *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        className="form-control bg-light"
                        value={formData.maxMarks}
                        onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-dark">Due Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control bg-light"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-dark">Allowed Submission Type</label>
                      <select
                        className="form-select bg-light"
                        value={formData.allowedSubmissionType}
                        onChange={(e) => setFormData({ ...formData, allowedSubmissionType: e.target.value })}
                      >
                        <option value="TEXT">Text Only</option>
                        <option value="FILE">File Upload Only</option>
                        <option value="BOTH">Text or File Upload</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Brief Overview</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="Short 1-sentence assignment description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Detailed Instructions</label>
                    <textarea
                      className="form-control bg-light"
                      rows="4"
                      placeholder="Step-by-step requirements, submission format guidelines, and grading rubric..."
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Starter Template / Attachment (Optional)</label>
                    <input
                      type="file"
                      className="form-control bg-light"
                      onChange={(e) => setAttachmentFile(e.target.files[0] || null)}
                    />
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="allowLateSwitch"
                      checked={formData.allowLateSubmissions}
                      onChange={(e) => setFormData({ ...formData, allowLateSubmissions: e.target.checked })}
                    />
                    <label className="form-check-label small fw-semibold text-dark" htmlFor="allowLateSwitch">
                      Allow late submissions (marked with late tag)
                    </label>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 pb-4 px-4">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary fw-bold px-4 rounded-pill">
                    {saving ? 'Saving...' : 'Save Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!assignmentToDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete assignment "${assignmentToDelete?.title}"? All submitted student work and grades will also be permanently deleted.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setAssignmentToDelete(null)}
      />
    </div>
  );
};

export default ManageAssignments;
