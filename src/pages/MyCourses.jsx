import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/enrollmentService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentService.getMyEnrollments({ page: 0, size: 50 });
        setEnrollments(data.content || []);
      } catch (err) {
        console.error('Failed to load enrolled courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your enrolled courses..." />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Enrolled Courses</h2>
          <p className="text-muted small mb-0">Continue your curriculum and track ongoing module progress</p>
        </div>
        <Link to="/courses" className="btn btn-outline-primary fw-semibold rounded-pill px-4">
          <i className="bi bi-search me-1"></i> Browse More Courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
          <i className="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold text-dark">No courses enrolled yet</h4>
          <p className="text-muted small mb-4">You have not enrolled in any learning courses yet.</p>
          <Link to="/courses" className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm">
            Browse Course Catalog
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
  );
};

export default MyCourses;
