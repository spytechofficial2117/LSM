import React from 'react';
import './CustomAlertDialog.css'; // Import the dedicated CSS file

const CustomAlertDialog = ({ message, type, onConfirm, onCancel }) => {
  return (
    <div className="modal-fixed">
      <div className="modal-card">
        <p className="text-lg font-medium text-151603 whitespace-pre-wrap">{message}</p>
        <div className="modal-buttons">
          {type === 'confirm' && (
            <button onClick={onConfirm} className="btn-primary">Yes</button>
          )}
          <button onClick={onCancel || onConfirm} className={`${type === 'confirm' ? 'btn-secondary' : 'btn-primary'}`}>
            {type === 'confirm' ? 'No' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlertDialog;
