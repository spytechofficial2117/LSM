import React, { useState } from 'react';
import CustomAlertDialog from '../components/CustomAlertDialog';
import './AboutPage.css'; // Import the dedicated CSS file

const AboutPage = () => {
  const [applicantName, setApplicantName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [alertConfig, setAlertConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      setAlertConfig({
        message: 'Thank you for contacting us! We will get back to you shortly. (Simulated submission)',
        type: 'alert',
        onConfirm: () => {
          setAlertConfig(null);
          setApplicantName('');
          setInstitutionName('');
          setMobileNumber('');
          setEmail('');
          setDescription('');
        }
      });
    } catch (error) {
      console.error("Error submitting contact form (simulated):", error);
      setAlertConfig({
        message: `Failed to submit form: ${error.message} (Simulated failure)`,
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <h2 className="about-title">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div>
            <label htmlFor="applicantName" className="form-label">Applicant Name:</label>
            <input
              type="text"
              id="applicantName"
              className="input-field"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="institutionName" className="form-label">Institution Name:</label>
            <input
              type="text"
              id="institutionName"
              className="input-field"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="mobileNumber" className="form-label">Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              className="input-field"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label">E-mail:</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              id="description"
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what's this document about...."
            ></textarea>
          </div>
          <div className="submit-button-wrapper">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        <div className="contact-info-section">
          <p>Contact us: +00 98765 43210 - +00 12345 67890</p>
          <p>Mail: example@gmail.com</p>
        </div>
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

export default AboutPage;