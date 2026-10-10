import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { moduleService } from '../services/moduleService';
import { lessonService } from '../services/lessonService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageLessons = () => {
  const { id } = useParams();
  const { addToast } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Module modal state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  // Lesson modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '10m 00s',
    displayOrder: 1,
    resourcePath: '',
    published: true,
  });
  const [lessonVideoFile, setLessonVideoFile] = useState(null);
  const [lessonResourceFile, setLessonResourceFile] = useState(null);
  const [savingLesson, setSavingLesson] = useState(false);

  // Deletion confirm
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'module'|'lesson', id, title }

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseDetails(id);
      setCourse(data);
    } catch (err) {
      console.error('Failed to load course lessons', err);
      addToast('Failed to load curriculum.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  // Module operations
  const handleOpenModuleModal = (mod = null) => {
    if (mod) {
      setEditingModule(mod);
      setModuleTitle(mod.title);
      setModuleDesc(mod.description || '');
    } else {
      setEditingModule(null);
      setModuleTitle('');
      setModuleDesc('');
    }
    setShowModuleModal(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    try {
      if (editingModule) {
        await moduleService.updateModule(editingModule.id, {
          title: moduleTitle.trim(),
          description: moduleDesc,
          displayOrder: editingModule.displayOrder,
        });
        addToast('Module updated successfully.', 'success');
      } else {
        const currentCount = course.modules?.length || 0;
        await moduleService.createModule(course.id, {
          title: moduleTitle.trim(),
          description: moduleDesc,
          displayOrder: currentCount + 1,
        });
        addToast('Module created successfully.', 'success');
      }
      setShowModuleModal(false);
      loadCourse();
    } catch (err) {
      addToast('Failed to save module.', 'error');
    }
  };

  // Lesson operations
  const handleOpenLessonModal = (moduleId, lesson = null) => {
    setTargetModuleId(moduleId);
    setLessonVideoFile(null);
    setLessonResourceFile(null);

    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        description: lesson.description || '',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration || '10m 00s',
        displayOrder: lesson.displayOrder || 1,
        resourcePath: lesson.resourcePath || '',
        published: lesson.published !== false,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '',
        description: '',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '10m 00s',
        displayOrder: 1,
        resourcePath: '',
        published: true,
      });
    }
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;

    try {
      setSavingLesson(true);

      let localVideoPath = editingLesson?.localVideoPath || null;
      let resourcePath = lessonForm.resourcePath;

      if (lessonVideoFile) {
        const uploadResult = await fileService.uploadFile(lessonVideoFile, 'videos');
        localVideoPath = uploadResult.filePath;
      }

      if (lessonResourceFile) {
        const uploadRes = await fileService.uploadFile(lessonResourceFile, 'materials');
        resourcePath = uploadRes.filePath;
      }

      const payload = {
        ...lessonForm,
        localVideoPath,
        resourcePath,
      };

      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, payload);
        addToast('Lesson updated successfully.', 'success');
      } else {
        await lessonService.createLesson(targetModuleId, payload);
        addToast('Lesson added to module successfully.', 'success');
      }

      setShowLessonModal(false);
      loadCourse();
    } catch (err) {
      addToast('Failed to save lesson.', 'error');
    } finally {
      setSavingLesson(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'module') {
        await moduleService.deleteModule(itemToDelete.id);
        addToast('Module deleted.', 'info');
      } else {
        await lessonService.deleteLesson(itemToDelete.id);
        addToast('Lesson deleted.', 'info');
      }
      loadCourse();
    } catch (err) {
      addToast('Failed to delete item.', 'error');
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course curriculum..." />;
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/manage-courses" className="text-decoration-none">Manage Courses</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{course?.title} - Curriculum</li>
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Curriculum & Video Lessons</h2>
          <p className="text-muted small mb-0">{course?.title} &bull; Manage modules and video content</p>
        </div>

        <div className="d-flex gap-2">
          <Link to={`/courses/${id}/learn`} className="btn btn-outline-primary fw-semibold rounded-pill px-3">
            <i className="bi bi-play-circle me-1"></i> Preview Classroom
          </Link>
          <button
            className="btn btn-primary fw-semibold rounded-pill px-4 shadow-sm"
            onClick={() => handleOpenModuleModal()}
          >
            <i className="bi bi-plus-lg me-1"></i> Add Module
          </button>
        </div>
      </div>

      {/* Modules and Lessons List */}
      {(!course.modules || course.modules.length === 0) ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
          <i className="bi bi-collection-play fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">No modules created yet</h5>
          <p className="text-muted small mb-3">Organize your course content into structured chapters or modules.</p>
          <button
            className="btn btn-primary fw-semibold rounded-pill px-4"
            onClick={() => handleOpenModuleModal()}
          >
            Create First Module
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {course.modules.map((mod, modIdx) => (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white" key={mod.id}>
              {/* Module Header Bar */}
              <div className="card-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary text-white rounded-circle p-2" style={{ width: '28px', height: '28px' }}>
                    {modIdx + 1}
                  </span>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{mod.title}</h6>
                    {mod.description && <small className="text-muted">{mod.description}</small>}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                    onClick={() => handleOpenLessonModal(mod.id)}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add Lesson
                  </button>
                  <button
                    className="btn btn-sm btn-light border rounded-circle"
                    title="Edit Module"
                    onClick={() => handleOpenModuleModal(mod)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-light border text-danger rounded-circle"
                    title="Delete Module"
                    onClick={() => setItemToDelete({ type: 'module', id: mod.id, title: mod.title })}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              {/* Lessons Sub-List */}
              <div className="card-body p-0">
                {(!mod.lessons || mod.lessons.length === 0) ? (
                  <div className="text-center py-4 text-muted small">
                    No lessons in this module. Click "Add Lesson" to upload or link a video.
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {mod.lessons.map((lesson, lessonIdx) => (
                      <div
                        key={lesson.id}
                        className="list-group-item p-3 d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span className="small text-muted fw-bold">{modIdx + 1}.{lessonIdx + 1}</span>
                          <i className="bi bi-play-circle-fill text-primary fs-5"></i>
                          <div>
                            <div className="fw-semibold text-dark small">{lesson.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              <i className="bi bi-clock me-1"></i> {lesson.duration || 'Video'} &bull;{' '}
                              {lesson.localVideoPath ? (
                                <span className="text-success"><i className="bi bi-hdd me-1"></i> Local Video File</span>
                              ) : (
                                <span className="text-info"><i className="bi bi-link-45deg me-1"></i> Video URL</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-1">
                          <button
                            className="btn btn-sm btn-light border rounded-pill px-2"
                            title="Edit Lesson"
                            onClick={() => handleOpenLessonModal(mod.id, lesson)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger rounded-pill px-2"
                            title="Delete Lesson"
                            onClick={() => setItemToDelete({ type: 'lesson', id: lesson.id, title: lesson.title })}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module Edit/Create Modal */}
      {showModuleModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSaveModule}>
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold text-dark">
                    {editingModule ? 'Edit Module' : 'Create New Module'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModuleModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Module Title *</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. Chapter 1: Foundations"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Module Description</label>
                    <textarea
                      className="form-control bg-light"
                      rows="3"
                      placeholder="What is covered in this module..."
                      value={moduleDesc}
                      onChange={(e) => setModuleDesc(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 pb-4 px-4">
                  <button type="button" className="btn btn-light" onClick={() => setShowModuleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 rounded-pill">
                    Save Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Edit/Create Modal */}
      {showLessonModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSaveLesson}>
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold text-dark">
                    {editingLesson ? 'Edit Video Lesson' : 'Add New Lesson'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowLessonModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Lesson Title *</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. 1.1 Introduction to Components"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-dark">Duration Label</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        placeholder="e.g. 14m 20s"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-dark">Display Order</label>
                      <input
                        type="number"
                        className="form-control bg-light"
                        value={lessonForm.displayOrder}
                        onChange={(e) => setLessonForm({ ...lessonForm, displayOrder: parseInt(e.target.value, 10) || 1 })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Lesson Description</label>
                    <textarea
                      className="form-control bg-light"
                      rows="3"
                      placeholder="Summary of concepts covered in this lesson..."
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Video Source (URL or Local Upload)</label>
                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <input
                          type="text"
                          className="form-control bg-light"
                          placeholder="Video URL (e.g. MP4 stream URL)"
                          value={lessonForm.videoUrl}
                          onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <input
                          type="file"
                          accept="video/*"
                          className="form-control bg-light"
                          onChange={(e) => setLessonVideoFile(e.target.files[0] || null)}
                        />
                        <small className="text-muted d-block">Or upload MP4 / WebM locally</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Downloadable Resource / Materials (Optional)</label>
                    <input
                      type="file"
                      className="form-control bg-light"
                      onChange={(e) => setLessonResourceFile(e.target.files[0] || null)}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 pb-4 px-4">
                  <button type="button" className="btn btn-light" onClick={() => setShowLessonModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={savingLesson} className="btn btn-primary fw-bold px-4 rounded-pill">
                    {savingLesson ? 'Uploading & Saving...' : 'Save Lesson'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={`Delete ${itemToDelete?.type === 'module' ? 'Module' : 'Lesson'}`}
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default ManageLessons;
