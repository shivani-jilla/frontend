import React from 'react';

const LessonList = ({ modules = [], activeLessonId, onSelectLesson, completedLessonIds = new Set() }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="card-header bg-white border-bottom p-3">
        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-list-nested text-primary"></i> Course Curriculum
        </h6>
      </div>

      <div className="accordion accordion-flush" id="curriculumAccordion">
        {modules.map((mod, modIdx) => (
          <div className="accordion-item" key={mod.id}>
            <h2 className="accordion-header" id={`heading-${mod.id}`}>
              <button
                className="accordion-button fw-semibold py-3 px-3 text-dark bg-light"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${mod.id}`}
                aria-expanded="true"
                aria-controls={`collapse-${mod.id}`}
              >
                <div className="d-flex align-items-center justify-content-between w-100 me-2">
                  <span className="small text-truncate" style={{ maxWidth: '80%' }}>
                    {mod.title}
                  </span>
                  <span className="badge bg-secondary-subtle text-secondary small rounded-pill">
                    {mod.lessons ? mod.lessons.length : 0} lessons
                  </span>
                </div>
              </button>
            </h2>

            <div
              id={`collapse-${mod.id}`}
              className={`accordion-collapse collapse ${modIdx === 0 ? 'show' : ''}`}
              aria-labelledby={`heading-${mod.id}`}
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  {mod.lessons && mod.lessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    const isCompleted = completedLessonIds.has(lesson.id) || lesson.completed;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 px-3 border-0 border-bottom ${
                          isActive ? 'bg-primary-subtle text-primary fw-bold' : ''
                        }`}
                        onClick={() => onSelectLesson(lesson)}
                      >
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                          <i
                            className={`bi ${
                              isCompleted
                                ? 'bi-check-circle-fill text-success fs-5'
                                : isActive
                                ? 'bi-play-circle-fill text-primary fs-5'
                                : 'bi-circle text-muted fs-5'
                            } flex-shrink-0`}
                          ></i>
                          <div className="text-start overflow-hidden">
                            <div className="small text-truncate">{lesson.title}</div>
                            {lesson.duration && (
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                <i className="bi bi-clock me-1"></i> {lesson.duration}
                              </div>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <span className="badge bg-primary text-white rounded-pill px-2 py-1 ms-2" style={{ fontSize: '0.65rem' }}>
                            Playing
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;
