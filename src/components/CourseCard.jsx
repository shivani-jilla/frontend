import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { fileService } from '../services/fileService';

const CourseCard = ({ course, isEnrolled = false, progressPercentage = 0 }) => {
  const thumbnail = course.thumbnailPath
    ? fileService.getFileUrl(course.thumbnailPath)
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return <span className="badge-custom badge-beginner"><i className="bi bi-reception-1"></i> Beginner</span>;
      case 'intermediate':
        return <span className="badge-custom badge-intermediate"><i className="bi bi-reception-2"></i> Intermediate</span>;
      case 'advanced':
        return <span className="badge-custom badge-advanced"><i className="bi bi-reception-4"></i> Advanced</span>;
      default:
        return <span className="badge-custom badge-intermediate">{difficulty || 'General'}</span>;
    }
  };

  return (
    <div className="card h-100 app-card app-card-interactive border-0 shadow-sm d-flex flex-column">
      <div className="position-relative overflow-hidden" style={{ height: '190px' }}>
        <img
          src={thumbnail}
          alt={course.title}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-2 py-1 small">
            {course.category}
          </span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          {getDifficultyBadge(course.difficulty)}
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <h5 className="card-title fw-bold text-dark mb-2 text-truncate-2" style={{ minHeight: '3rem' }}>
          {course.title}
        </h5>

        <p className="card-text text-muted small mb-3 text-truncate-2 flex-grow-1">
          {course.shortDescription || course.description}
        </p>

        {isEnrolled && (
          <div className="mb-3 pt-2 border-top">
            <ProgressBar percentage={progressPercentage} height={6} />
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto small text-muted">
          <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: '60%' }}>
            <i className="bi bi-person-circle text-primary"></i>
            <span className="text-truncate fw-medium">{course.instructor?.name || 'Instructor'}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-clock text-secondary"></i>
            <span>{course.duration || 'Self-paced'}</span>
          </div>
        </div>

        <div className="mt-3">
          {isEnrolled ? (
            <Link to={`/courses/${course.id}/learn`} className="btn btn-primary w-100 fw-semibold rounded-pill py-2 shadow-sm">
              <i className="bi bi-play-circle-fill me-2"></i> Continue Learning
            </Link>
          ) : (
            <Link to={`/courses/${course.id}`} className="btn btn-outline-primary w-100 fw-semibold rounded-pill py-2">
              View Course Details <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
