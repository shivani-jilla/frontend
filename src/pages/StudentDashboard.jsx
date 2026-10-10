import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { gradeService } from '../services/gradeService';
import { adminService } from '../services/adminService';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollmentData, gradesData, statsData] = await Promise.all([
          enrollmentService.getMyEnrollments({ page: 0, size: 6 }),
          gradeService.getMyGrades(),
          adminService.getStudentStats(),
        ]);
        setEnrollments(enrollmentData.content || []);
        setGrades(gradesData || []);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your learning dashboard..." />;
  }

  // Find the last enrolled course with progress to display in "Continue Learning" banner
  const continueCourse = enrollments.length > 0 ? enrollments[0] : null;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Welcome Banner */}
      <div
        className="rounded-4 p-4 p-md-5 text-white shadow-sm position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a, #0284c7)' }}
      >
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-1 mb-3">
              <i className="bi bi-mortarboard-fill me-1"></i> Student Portal
            </span>
            <h2 className="display-6 fw-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="lead text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
              Keep up the momentum! You have {enrollments.length} enrolled {enrollments.length === 1 ? 'course' : 'courses'} in progress.
            </p>
          </div>
          <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
            <Link to="/courses" className="btn btn-light fw-bold px-4 py-2 rounded-pill shadow text-primary">
              <i className="bi bi-plus-lg me-1"></i> Explore New Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Enrolled Courses</div>
              <h3 className="fw-bold text-dark mb-0">{enrollments.length}</h3>
            </div>
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-journal-bookmark-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Completed Lessons</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.studentCompletedLessons || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <i className="bi bi-check2-circle"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Graded Assignments</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.studentGradedAssignments || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <i className="bi bi-award-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Pending Reviews</div>
              <h3 className="fw-bold text-dark mb-0">{stats?.studentPendingAssignments || 0}</h3>
            </div>
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <i className="bi bi-hourglass-split"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Spotlight */}
      {continueCourse && (
        <div className="card border-0 shadow-sm rounded-4 p-4 app-card bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center p-3 flex-shrink-0"
                style={{ width: '64px', height: '64px' }}
              >
                <i className="bi bi-play-circle-fill fs-2"></i>
              </div>
              <div>
                <span className="badge bg-primary-subtle text-primary small rounded-pill px-2 py-1 mb-1">
                  Continue Learning
                </span>
                <h5 className="fw-bold text-dark mb-1">{continueCourse.course?.title}</h5>
                <div className="small text-muted">
                  Completed {continueCourse.completedLessons} of {continueCourse.totalLessons} lessons
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 flex-shrink-0">
              <div style={{ minWidth: '180px' }}>
                <ProgressBar percentage={continueCourse.progressPercentage} height={8} />
              </div>
              <Link
                to={`/courses/${continueCourse.course?.id}/learn`}
                className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
              >
                Resume Course <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark mb-0">My Enrolled Courses</h4>
          <Link to="/my-courses" className="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3">
            View All
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border border-dashed">
            <i className="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-dark">You have not enrolled in any courses yet</h5>
            <p className="text-muted small mb-4">Explore our wide selection of technical and practical courses.</p>
            <Link to="/courses" className="btn btn-primary fw-semibold px-4 py-2 rounded-pill shadow-sm">
              Explore Course Catalog
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {enrollments.map((enr) => (
              <div className="col" key={enr.id}>
                <CourseCard
                  course={enr.course}
                  isEnrolled={true}
                  progressPercentage={enr.progressPercentage}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Grades & Feedback Preview */}
      {grades.length > 0 && (
        <div className="card border-0 shadow-sm rounded-4 p-4 app-card bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">Recent Grades & Feedback</h5>
            <Link to="/my-grades" className="text-primary small fw-semibold text-decoration-none">
              View Full Gradebook <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="list-group list-group-flush">
            {grades.slice(0, 3).map((g) => (
              <div key={g.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                <div>
                  <div className="fw-bold text-dark">{g.assignmentTitle}</div>
                  <div className="small text-muted">{g.courseTitle}</div>
                  {g.feedback && (
                    <div className="small text-muted mt-1 fst-italic">
                      "{g.feedback}"
                    </div>
                  )}
                </div>
                <div className="text-end">
                  {g.status === 'GRADED' ? (
                    <div>
                      <span className="fw-bold text-success fs-5">{g.marksAwarded}</span>
                      <span className="text-muted small"> / {g.maxMarks}</span>
                      <div className="badge bg-success-subtle text-success d-block mt-1">
                        {g.percentage}%
                      </div>
                    </div>
                  ) : (
                    <span className="badge bg-warning-subtle text-warning">
                      Pending Grading
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
