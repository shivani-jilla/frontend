import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import CourseGrid from '../components/CourseGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const direction = searchParams.get('direction') || 'desc';

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await courseService.getPublishedCourses({
          search: search || undefined,
          category: category || undefined,
          difficulty: difficulty || undefined,
          page,
          size: 9,
          sortBy,
          direction,
        });
        setCourses(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error('Failed to load catalog courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, difficulty, page, sortBy, direction]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset to first page
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const inputVal = e.target.elements.searchInput.value;
    updateFilter('search', inputVal);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
          Explore Academy
        </span>
        <h1 className="fw-bold text-dark mb-2">Available Course Catalog</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Discover our rich technical curricula led by knowledgeable educators. Search, filter by skill level, and begin learning.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search bar */}
          <div className="col-12 col-md-5">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  name="searchInput"
                  defaultValue={search}
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="Search course title or topic..."
                />
                <button type="submit" className="btn btn-primary px-3 fw-semibold">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Category Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select bg-light py-2"
              value={category}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select bg-light py-2"
              value={difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-12 col-md-2 text-md-end">
            {(search || category || difficulty) && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm rounded-pill w-100"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle me-1"></i> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold text-muted mb-0">
          Showing <span className="fw-bold text-dark">{totalElements}</span> {totalElements === 1 ? 'course' : 'courses'}
        </h5>
      </div>

      {/* Course Grid */}
      {loading ? (
        <LoadingSpinner text="Searching courses..." />
      ) : (
        <CourseGrid courses={courses} emptyMessage="No matching courses found." />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
            disabled={page === 0}
            onClick={() => updateFilter('page', (page - 1).toString())}
          >
            <i className="bi bi-chevron-left me-1"></i> Previous
          </button>
          <span className="small text-muted fw-bold px-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
            disabled={page >= totalPages - 1}
            onClick={() => updateFilter('page', (page + 1).toString())}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
