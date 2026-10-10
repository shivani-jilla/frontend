import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EditCourse = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseDetails(id);
        setFormData({
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          category: data.category || 'Web Development',
          difficulty: data.difficulty || 'Intermediate',
          duration: data.duration || '',
          learningObjectives: data.learningObjectives || '',
          prerequisites: data.prerequisites || '',
          thumbnailPath: data.thumbnailPath || '',
          published: data.published || false,
        });
      } catch (err) {
        console.error('Failed to load course for editing', err);
        setError('Failed to load course information.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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
      setSaving(true);
      setError('');

      let thumbnailPath = formData.thumbnailPath;
      if (thumbnailFile) {
        const uploadResult = await fileService.uploadFile(thumbnailFile, 'thumbnails');
        thumbnailPath = uploadResult.filePath;
      }

      await courseService.updateCourse(id, {
        ...formData,
        thumbnailPath,
      });

      addToast('Course details updated successfully!', 'success');
      navigate('/manage-courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  return (
    <div className="container py-5" style={{ maxWidth: '820px' }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/manage-courses" className="text-decoration-none">Manage Courses</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 className="fw-bold text-dark mb-1">Edit Course Details</h2>
        <p className="text-muted small mb-4">Modify course information, categorization, and publication state</p>

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
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Short Summary</label>
            <input
              type="text"
              name="shortDescription"
              className="form-control bg-light"
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
                value={formData.prerequisites}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-dark">Cover Thumbnail</label>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control bg-light mb-2"
                  onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
                />
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  name="thumbnailPath"
                  className="form-control bg-light"
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
              id="publishSwitchEdit"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold text-dark small" htmlFor="publishSwitchEdit">
              Published to Public Catalog
            </label>
          </div>

          <div className="d-flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
            >
              {saving ? 'Saving Changes...' : 'Save Course Details'}
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

export default EditCourse;
