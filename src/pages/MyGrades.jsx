import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gradeService } from '../services/gradeService';
import GradeCard from '../components/GradeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await gradeService.getMyGrades();
        setGrades(data || []);
      } catch (err) {
        console.error('Failed to load grades', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling your verified academic gradebook..." />;
  }

  // Calculate overall performance
  const gradedList = grades.filter((g) => g.status === 'GRADED' && g.marksAwarded != null);
  const totalAwarded = gradedList.reduce((acc, curr) => acc + Number(curr.marksAwarded), 0);
  const totalMax = gradedList.reduce((acc, curr) => acc + Number(curr.maxMarks), 0);
  const averagePercentage = totalMax > 0 ? ((totalAwarded / totalMax) * 100).toFixed(1) : 0;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Academic Gradebook</h2>
          <p className="text-muted small mb-0">Transparent records of your marks, assignment scores, and written instructor feedback</p>
        </div>
        <Link to="/my-courses" className="btn btn-outline-primary fw-semibold rounded-pill px-4">
          <i className="bi bi-journal-bookmark me-1"></i> My Courses
        </Link>
      </div>

      {/* Summary Score Banner */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Average Grade Score</div>
              <h3 className="fw-bold text-success mb-0">{averagePercentage}%</h3>
            </div>
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <i className="bi bi-graph-up-arrow"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Graded Assignments</div>
              <h3 className="fw-bold text-dark mb-0">{gradedList.length}</h3>
            </div>
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-award-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div>
              <div className="text-muted small fw-semibold">Pending Evaluation</div>
              <h3 className="fw-bold text-warning mb-0">{grades.length - gradedList.length}</h3>
            </div>
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <i className="bi bi-hourglass-split"></i>
            </div>
          </div>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed my-4">
          <i className="bi bi-award fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">No assignment submissions found</h5>
          <p className="text-muted small mb-3">Submit your course assignments to see your evaluated grades and remarks here.</p>
          <Link to="/courses" className="btn btn-primary fw-semibold rounded-pill px-4 shadow-sm">
            Go to Course Catalog
          </Link>
        </div>
      ) : (
        <div>
          {grades.map((submission) => (
            <GradeCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGrades;
