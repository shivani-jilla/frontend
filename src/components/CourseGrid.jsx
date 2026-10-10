import React from 'react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses = [], enrolledCourseIds = new Set(), progresses = {}, emptyMessage = 'No courses found.' }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
        <div className="py-4">
          <i className="bi bi-journal-x display-4 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">{emptyMessage}</h5>
          <p className="text-muted small">Try adjusting your filters or search keywords.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {courses.map((course) => {
        const isEnrolled = enrolledCourseIds.has(course.id) || course.enrolled;
        const progress = progresses[course.id] !== undefined ? progresses[course.id] : course.progressPercentage || 0;
        return (
          <div className="col" key={course.id}>
            <CourseCard
              course={course}
              isEnrolled={isEnrolled}
              progressPercentage={progress}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CourseGrid;
