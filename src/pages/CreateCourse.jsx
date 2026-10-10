import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';

const CreateCourse = () => {
  const { addToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '8 Weeks',
    learningObjectives: '',
    prerequisites: '',
    thumbnailPath: '',
    published: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category || !formData.difficulty) {
      setError('Please fill in the required fields (Title, Category, Difficulty).');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let thumbnailPath = formData.thumbnailPath;
      if (thumbnailFile) {
        const uploadResult = await fileService.uploadFile(thumbnailFile, 'thumbnails');
        thumbnailPath = uploadResult.filePath;
      }

      const created = await courseService.createCourse({
        ...formData,
        thumbnailPath,
      });

      addToast(`Course "${created.title}" created successfully!`, 'success');
      navigate(`/courses/${created.id}/manage-lessons`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '820px' }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/manage-courses" className="text-decoration-none">Manage Courses</Link></li>
          <li className="breadcrumb-item active" aria-current="page">New Course</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 className="fw-bold text-dark mb-1">Create New Course</h2>
        <p className="text-muted small mb-4">Set up your curriculum details, objectives, and cover image</p>

        {error && (
          <div className="alert alert-danger small p-3 rounded-3 mb-4">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Course Title *</label>
            <input
              type="text"
              name="title"
              className="form-control bg-light"
              placeholder="e.g. Modern Full-Stack Web Development"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-dark">Category *</label>
              <select
                name="category"
                className="form-select bg-light"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Web Development">Web Development</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-dark">Difficulty Level *</label>
              <select
                name="difficulty"
                className="form-select bg-light"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-dark">Estimated Duration</label>
              <input
                type="text"
                name="duration"
                className="form-control bg-light"
                placeholder="e.g. 10 Weeks or 15 Hours"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Short Summary / Tagline</label>
            <input
              type="text"
              name="shortDescription"
              className="form-control bg-light"
              placeholder="Brief 1-sentence summary of the course"
              value={formData.shortDescription}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Detailed Description</label>
            <textarea
              name="description"
              className="form-control bg-light"
              rows="5"
              placeholder="Comprehensive course overview, syllabus outline, and target audience..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-dark">Learning Objectives</label>
              <textarea
                name="learningObjectives"
                className="form-control bg-light"
                rows="4"
                placeholder="• Core skills taught&#10;• Tools mastered"
                value={formData.learningObjectives}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-dark">Prerequisites</label>
              <textarea
                name="prerequisites"
                className="form-control bg-light"
                rows="4"
                placeholder="Prior knowledge or software recommended before starting"
                value={formData.prerequisites}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-dark">Course Cover Thumbnail</label>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control bg-light mb-2"
                  onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
                />
                <small className="text-muted d-block">Upload an image file (PNG, JPG, WebP)</small>
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  name="thumbnailPath"
                  className="form-control bg-light"
                  placeholder="Or paste an image URL (e.g. Unsplash URL)"
                  value={formData.thumbnailPath}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="publishSwitch"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold text-dark small" htmlFor="publishSwitch">
              Publish immediately to public course catalog
            </label>
          </div>

          <div className="d-flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
            >
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Creating...</span>
              ) : (
                'Create Course & Add Lessons'
              )}
            </button>
            <Link to="/manage-courses" className="btn btn-light fw-semibold px-4 py-2 rounded-pill">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
