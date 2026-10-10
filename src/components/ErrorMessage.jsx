import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm my-3" role="alert">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-exclamation-octagon-fill fs-4 text-danger"></i>
        <div>
          <strong>Error: </strong>
          <span>{message || 'Something went wrong while processing your request.'}</span>
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
