import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center my-4">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 text-muted fw-semibold">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
