import React from 'react';

const ProgressBar = ({ percentage = 0, height = 8, showLabel = true, color = '#2563eb' }) => {
  const safePercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <div className="w-100">
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="small text-muted fw-semibold">Progress</span>
          <span className="small fw-bold" style={{ color }}>
            {safePercentage}%
          </span>
        </div>
      )}
      <div
        className="progress"
        style={{
          height: `${height}px`,
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{
            width: `${safePercentage}%`,
            backgroundColor: color,
            transition: 'width 0.5s ease-in-out',
          }}
          aria-valuenow={safePercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
