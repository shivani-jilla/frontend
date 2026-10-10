import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { fileService } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, addToast } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseDetails(id);
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentService.enroll(course.id);
      addToast(`Successfully enrolled in ${course.title}!`, 'success');
      setCourse((prev) => ({ ...prev, enrolled: true }));
      navigate(`/courses/${course.id}/learn`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed.';
      addToast(msg, 'error');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h4>Course not found</h4>
        <Link to="/courses" className="btn btn-primary mt-3">Back to Catalog</Link>
      </div>
    );
  }

  const thumbnail = course.thumbnailPath
    ? fileService.getFileUrl(course.thumbnailPath)
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/courses" className="text-decoration-none">Catalog</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Course Info Column */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-1 rounded-pill">
              {course.category}
            </span>
            <span className="badge bg-secondary-subtle text-secondary fw-semibold px-3 py-1 rounded-pill">
              {course.difficulty} Level
            </span>
            <span className="badge bg-light text-dark border px-3 py-1 rounded-pill">
              <i className="bi bi-clock me-1"></i> {course.duration || 'Self-paced'}
            </span>
          </div>

          <h1 className="fw-bold text-dark mb-3 display-6">{course.title}</h1>
          <p className="lead text-muted mb-4">{course.shortDescription}</p>

          {/* Instructor Header */}
          <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mb-4 border">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0"
              style={{ width: '48px', height: '48px' }}
            >
              {course.instructor?.name?.charAt(0) || 'I'}
            </div>
            <div>
              <div className="small text-muted">Course Instructor</div>
              <div className="fw-bold text-dark">{course.instructor?.name}</div>
              <div className="small text-muted">{course.instructor?.email}</div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="mb-5">
            <h4 className="fw-bold text-dark mb-3">About this Course</h4>
            <div className="text-muted lh-lg" style={{ whiteSpace: 'pre-line' }}>
              {course.description}
            </div>
          </div>

          {/* Objectives */}
          {course.learningObjectives && (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-4 border-primary">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-bullseye text-primary me-2"></i> What You'll Learn
              </h5>
              <div className="text-muted lh-lg" style={{ whiteSpace: 'pre-line' }}>
                {course.learningObjectives}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
              <h5 className="fw-bold text-dark mb-2">
                <i className="bi bi-clipboard-check text-secondary me-2"></i> Course Prerequisites
              </h5>
              <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                {course.prerequisites}
              </div>
            </div>
          )}

          {/* Curriculum Preview */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-dark mb-0">Syllabus & Curriculum</h4>
              <span className="small text-muted">
                {course.totalModules || 0} modules &bull; {course.totalLessons || 0} lessons
              </span>
            </div>

            <div className="accordion accordion-flush bg-white rounded-4 shadow-sm border overflow-hidden" id="detailsAccordion">
              {course.modules && course.modules.map((mod, mIdx) => (
                <div className="accordion-item" key={mod.id}>
                  <h2 className="accordion-header" id={`detail-head-${mod.id}`}>
                    <button
                      className="accordion-button fw-bold py-3 px-4 bg-light text-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#detail-collapse-${mod.id}`}
                      aria-expanded="true"
                    >
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <span>{mod.title}</span>
                        <span className="badge bg-secondary-subtle text-secondary small rounded-pill">
                          {mod.lessons ? mod.lessons.length : 0} lessons
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`detail-collapse-${mod.id}`}
                    className={`accordion-collapse collapse ${mIdx === 0 ? 'show' : ''}`}
                  >
                    <div className="accordion-body p-0">
                      <ul className="list-group list-group-flush">
                        {mod.lessons && mod.lessons.map((lesson) => (
                          <li key={lesson.id} className="list-group-item py-3 px-4 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-play-circle text-primary"></i>
                              <span className="small fw-medium text-dark">{lesson.title}</span>
                            </div>
                            <span className="small text-muted">{lesson.duration || 'Video'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Enrollment Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden sticky-top" style={{ top: '90px' }}>
            <img src={thumbnail} alt={course.title} className="w-100 object-fit-cover" style={{ height: '220px' }} />

            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill">
                  Open Enrollment
                </span>
                <span className="small text-muted">
                  <i className="bi bi-people me-1"></i> {course.totalEnrolled || 0} students
                </span>
              </div>

              {course.enrolled ? (
                <div className="d-grid gap-2">
                  <div className="alert alert-success d-flex align-items-center gap-2 p-2 rounded-3 small mb-2">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>You are enrolled in this course</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}/learn`}
                    className="btn btn-primary py-3 fw-bold rounded-pill shadow-sm"
                  >
                    <i className="bi bi-play-circle-fill me-2"></i> Go to Learning Player
                  </Link>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary py-3 fw-bold rounded-pill shadow-md"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <span><span className="spinner-border spinner-border-sm me-2"></span>Enrolling...</span>
                    ) : (
                      <span><i className="bi bi-mortarboard-fill me-2"></i> Enroll Now (Free)</span>
                    )}
                  </button>
                </div>
              )}

              <hr className="my-4" />

              <h6 className="fw-bold text-dark mb-3">Course Includes:</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-0">
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-play-btn-fill text-primary"></i>
                  <span>{course.totalLessons || 0} high-definition video lessons</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-code-fill text-primary"></i>
                  <span>Practical assignment grading & written feedback</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-primary"></i>
                  <span>Lifetime access & progress tracking</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-award-fill text-primary"></i>
                  <span>Verified gradebook evaluation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
