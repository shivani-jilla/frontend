import React, { useRef, useEffect } from 'react';
import { fileService } from '../services/fileService';

const VideoPlayer = ({ lesson, onComplete, onNext, hasNext = false, isCompleted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="bg-dark text-white d-flex align-items-center justify-content-center rounded-4 p-5 text-center" style={{ minHeight: '380px' }}>
        <div>
          <i className="bi bi-play-btn fs-1 text-muted mb-3 d-block"></i>
          <h5>Select a lesson to begin watching</h5>
        </div>
      </div>
    );
  }

  const videoSource = lesson.localVideoPath
    ? fileService.getFileUrl(lesson.localVideoPath)
    : lesson.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
      {/* Video Viewport */}
      <div className="video-container" style={{ maxHeight: '520px', backgroundColor: '#000' }}>
        <video
          ref={videoRef}
          controls
          className="w-100"
          style={{ maxHeight: '520px', outline: 'none' }}
          onEnded={onComplete}
        >
          <source src={videoSource} type="video/mp4" />
          Your browser does not support HTML5 video streaming.
        </video>
      </div>

      {/* Lesson Controls Bar */}
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 mb-2">
              <i className="bi bi-clock me-1"></i> {lesson.duration || 'Video Lesson'}
            </span>
            <h4 className="fw-bold text-dark mb-1">{lesson.title}</h4>
            <p className="text-muted small mb-0">{lesson.description}</p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              className={`btn ${isCompleted ? 'btn-success' : 'btn-outline-success'} fw-semibold d-flex align-items-center gap-2 px-3 py-2 rounded-pill`}
              onClick={onComplete}
            >
              <i className={`bi ${isCompleted ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>

            {hasNext && (
              <button
                className="btn btn-primary fw-semibold d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                onClick={onNext}
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            )}
          </div>
        </div>

        {lesson.resourcePath && (
          <div className="mt-4 pt-3 border-top">
            <h6 className="fw-bold text-dark small mb-2">
              <i className="bi bi-paperclip me-1"></i> Lesson Attachments & Materials:
            </h6>
            <a
              href={fileService.getFileUrl(lesson.resourcePath)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-light border fw-medium rounded-pill text-primary"
            >
              <i className="bi bi-download me-1"></i> Download Supplementary File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
