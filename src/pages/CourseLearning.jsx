import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { lessonService } from '../services/lessonService';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import LessonList from '../components/LessonList';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseLearning = () => {
  const { id } = useParams();
  const { addToast } = useAuth();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const data = await courseService.getCourseDetails(id);
        setCourse(data);
        setProgressPercentage(data.progressPercentage || 0);

        // Gather all lessons across all modules
        const allLessons = [];
        const completedIds = new Set();

        if (data.modules) {
          data.modules.forEach((mod) => {
            if (mod.lessons) {
              mod.lessons.forEach((l) => {
                allLessons.push(l);
                if (l.completed) {
                  completedIds.add(l.id);
                }
              });
            }
          });
        }

        setCompletedLessonIds(completedIds);

        // Select first lesson or the first incomplete lesson
        if (allLessons.length > 0) {
          const firstIncomplete = allLessons.find((l) => !completedIds.has(l.id));
          const selected = firstIncomplete || allLessons[0];
          setActiveLesson(selected);
          lessonService.recordLessonAccess(selected.id).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to load course classroom', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [id]);

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    lessonService.recordLessonAccess(lesson.id).catch(() => {});
  };

  const handleToggleComplete = async () => {
    if (!activeLesson) return;

    try {
      const res = await lessonService.markLessonComplete(activeLesson.id);
      const isNowCompleted = res.completed;

      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        if (isNowCompleted) {
          next.add(activeLesson.id);
        } else {
          next.delete(activeLesson.id);
        }
        return next;
      });

      if (res.progressPercentage !== undefined) {
        setProgressPercentage(res.progressPercentage);
      }

      addToast(
        isNowCompleted ? `Lesson marked completed! (${res.progressPercentage}%)` : 'Lesson marked incomplete.',
        'success'
      );
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update lesson progress.', 'error');
    }
  };

  // Find next lesson
  const findNextLesson = () => {
    if (!course || !course.modules || !activeLesson) return null;
    const all = [];
    course.modules.forEach((m) => m.lessons && all.push(...m.lessons));
    const currIdx = all.findIndex((l) => l.id === activeLesson.id);
    if (currIdx >= 0 && currIdx < all.length - 1) {
      return all[currIdx + 1];
    }
    return null;
  };

  const nextLesson = findNextLesson();

  const handleNext = () => {
    if (nextLesson) {
      handleSelectLesson(nextLesson);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing video classroom and curriculum..." />;
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h4>Course not found</h4>
        <Link to="/courses" className="btn btn-primary mt-3">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid px-lg-5 py-4">
      {/* Top Learning Navigation & Progress Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 small text-muted mb-1">
              <Link to="/my-courses" className="text-decoration-none text-muted">
                <i className="bi bi-chevron-left me-1"></i> My Courses
              </Link>
              <span>&bull;</span>
              <span className="badge bg-light text-primary border">{course.category}</span>
            </div>
            <h4 className="fw-bold text-dark mb-0">{course.title}</h4>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div style={{ minWidth: '220px' }}>
              <ProgressBar percentage={progressPercentage} height={10} />
            </div>

            <Link
              to={`/courses/${course.id}/assignments`}
              className="btn btn-outline-primary fw-semibold rounded-pill px-3 py-2 shadow-sm text-nowrap"
            >
              <i className="bi bi-journal-text me-1"></i> View Assignments
            </Link>
          </div>
        </div>
      </div>

      {/* Main Learning Classroom Grid */}
      <div className="row g-4">
        {/* Left: Video Player */}
        <div className="col-12 col-lg-8">
          <VideoPlayer
            lesson={activeLesson}
            isCompleted={activeLesson ? completedLessonIds.has(activeLesson.id) : false}
            onComplete={handleToggleComplete}
            onNext={handleNext}
            hasNext={!!nextLesson}
          />
        </div>

        {/* Right: Modules & Lessons Hierarchy */}
        <div className="col-12 col-lg-4">
          <LessonList
            modules={course.modules || []}
            activeLessonId={activeLesson?.id}
            onSelectLesson={handleSelectLesson}
            completedLessonIds={completedLessonIds}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
