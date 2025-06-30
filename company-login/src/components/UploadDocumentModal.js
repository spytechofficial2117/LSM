import React, { useState, useEffect } from 'react';
import CustomAlertDialog from './CustomAlertDialog';
import './UploadDocumentModal.css'; // Import the dedicated CSS file

const UploadDocumentModal = ({ showModal, closeModal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showModal) {
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setAlertConfig(null);
    }
  }, [showModal]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setAlertConfig({
        message: 'Title is required!',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }
    if (!selectedFile) {
        setAlertConfig({
            message: 'Please select a file to upload!',
            type: 'alert',
            onConfirm: () => setAlertConfig(null)
        });
        return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      setAlertConfig({
        message: 'Document metadata uploaded successfully! (Simulated upload)',
        type: 'alert',
        onConfirm: () => {
          setAlertConfig(null);
          closeModal();
        }
      });
    } catch (error) {
      console.error("Error uploading document metadata (simulated):", error);
      setAlertConfig({
        message: `Failed to upload document: ${error.message} (Simulated failure)`,
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="upload-modal-backdrop">
      <div className="upload-modal-content">
        <button onClick={closeModal} className="upload-modal-close-button">&times;</button>
        <h2 className="upload-modal-title">Make document easy to find!</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div>
            <label htmlFor="title" className="form-label">Title (Required)</label>
            <input
              type="text"
              id="title"
              className="input-field"
              placeholder="Enter title of your document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what's this document about...."
            ></textarea>
          </div>

          <div
            className="drag-drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div className="text-center">
              <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="drag-drop-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="drag-drop-text">Drag & drop files or <span className="underline">Browse</span></p>
              {selectedFile && <p className="selected-file-name">Selected file: {selectedFile.name}</p>}
            </div>
          </div>

          <div className="upload-button-wrapper">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
      {alertConfig && (
        <CustomAlertDialog
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
        />
      )}
    </div>
  );
};

export default UploadDocumentModal;