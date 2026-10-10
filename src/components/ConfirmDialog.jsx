import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Confirm', confirmVariant = 'danger', onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-3 px-4 text-muted">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0 pb-4 px-4 gap-2">
            <button type="button" className="btn btn-light fw-semibold px-3" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-${confirmVariant} fw-semibold px-4`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
