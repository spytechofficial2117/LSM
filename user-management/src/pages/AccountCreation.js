import React, { useState } from 'react';
import './AccountCreation.css'; 
import PageTitle from '../components/ui/PageTitle'; 
import TabButton from '../components/ui/TabButton'; 
import FormInput from '../components/ui/FormInput'; 
import CustomSelect from '../components/ui/CustomSelect';

// --- START: ManualEntry Component Definition ---
// Define ManualEntry as a top-level component.
// This prevents it from being re-defined and re-mounted every time AccountCreation re-renders.
const ManualEntry = ({
    manualEntryName, setManualEntryName,
    manualEntryEmail, setManualEntryEmail,
    manualEntryRole, setManualEntryRole,
    manualEntryDepartment, setManualEntryDepartment,
    manualEntryYear, setManualEntryYear
}) => {
    // Helper function to generate years can live here or be passed as a prop from parent
    // Keeping it here is fine if it doesn't need external dependencies from AccountCreation's scope
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = ["Select year", "N/A"];
        for (let i = currentYear; i >= currentYear - 50; i--) { // Generates years from current year down to 50 years ago
            years.push(String(i));
        }
        return years;
    };

    return (
        <div className="form-grid">
            <FormInput
                label="Name"
                placeholder="Enter user's full name"
                value={manualEntryName} // Input value is controlled by parent state
                onChange={(e) => setManualEntryName(e.target.value)} // Updates parent state
            />
            <FormInput
                label="Email"
                placeholder="Enter user's email address"
                value={manualEntryEmail} // Input value is controlled by parent state
                onChange={(e) => setManualEntryEmail(e.target.value)} // Updates parent state
            />
            <CustomSelect
                label="Role"
                options={["Select user role", "Student", "Faculty", "Staff"]}
                value={manualEntryRole} // Select value is controlled by parent state
                onChange={(e) => setManualEntryRole(e.target.value)} // Updates parent state
            />
            <CustomSelect
                label="Department"
                options={["Select Department", "Computer Science", "Mathematics", "Engineering", "Biology", "Arts", "Administration"]}
                value={manualEntryDepartment} // Select value is controlled by parent state
                onChange={(e) => setManualEntryDepartment(e.target.value)} // Updates parent state
            />
            <CustomSelect
                label="Year"
                options={generateYears()} // Options generated here
                value={manualEntryYear} // Select value is controlled by parent state
                onChange={(e) => setManualEntryYear(e.target.value)} // Updates parent state
            />
        </div>
    );
};
// --- END: ManualEntry Component Definition ---


// --- START: UploadFile Component Definition ---
// Define UploadFile as a top-level component for consistent structure
const UploadFile = ({ selectedFile, handleFileChange, handleUpload }) => (
    <div className="upload-box">
        <p className="upload-description">
            Upload a CSV or Excel file to create multiple accounts at once. Ensure the file includes columns for Name, Email, Role, Department, and Year.
        </p>
        <label className="upload-dropzone">
            <input
                type="file"
                accept=".csv,.xlsx"
                className="hidden-input"
                onChange={handleFileChange}
            />
            <div className="dropzone-content">
                <p className="dropzone-title">Drag and drop file here</p>
                <p className="dropzone-sub">or click to select CSV/Excel file</p>
            </div>
        </label>

        {selectedFile && (
            <div className="upload-actions">
                <p className="file-name">Selected: {selectedFile.name}</p>
                <button className="btn-primary upload-button" onClick={handleUpload}>
                    Upload File
                </button>
            </div>
        )}
    </div>
);
// --- END: UploadFile Component Definition ---


// --- START: AccountCreation Component Definition ---
const AccountCreation = () => {
    const [activeTab, setActiveTab] = useState('manual');
    const [previewUsers] = useState([
        { name: 'Ethan Harper', email: 'ethan.harper@example.com', role: 'Student', department: 'Computer Science', year: 'Sophomore', status: 'Valid' },
        { name: 'Olivia Bennett', email: 'olivia.bennett@example.com', role: 'Teacher', department: 'Engineering', year: 'N/A', status: 'Valid' },
        { name: 'Liam Carter', email: 'liam.carter@example.com', role: 'Student', department: 'Arts', year: 'Freshman', status: 'Duplicate' },
    ]);
    const [selectedFile, setSelectedFile] = useState(null);

    // State variables for Manual Entry form inputs
    const [manualEntryName, setManualEntryName] = useState('');
    const [manualEntryEmail, setManualEntryEmail] = useState('');
    const [manualEntryRole, setManualEntryRole] = useState('Select user role');
    const [manualEntryDepartment, setManualEntryDepartment] = useState('Select department');
    const [manualEntryYear, setManualEntryYear] = useState('');

    // Handlers for UploadFile component
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            alert(`Uploading: ${selectedFile.name}`);
        }
    };

    return (
        <div className="account-creation">
            <PageTitle
                title="Create Accounts"
                subtitle="Manually add users or upload a CSV/Excel file to create multiple accounts at once."
            />
            <div className="tab-header">
                <TabButton
                    text="Manual Entry"
                    isActive={activeTab === 'manual'}
                    onClick={() => setActiveTab('manual')}
                />
                <TabButton
                    text="Upload File"
                    isActive={activeTab === 'upload'}
                    onClick={() => setActiveTab('upload')}
                />
            </div>

            {/* Conditionally render ManualEntry or UploadFile */}
            {activeTab === 'manual' ? (
                // Pass all relevant state and setters as props to ManualEntry
                <ManualEntry
                    manualEntryName={manualEntryName}
                    setManualEntryName={setManualEntryName}
                    manualEntryEmail={manualEntryEmail}
                    setManualEntryEmail={setManualEntryEmail}
                    manualEntryRole={manualEntryRole}
                    setManualEntryRole={setManualEntryRole}
                    manualEntryDepartment={manualEntryDepartment}
                    setManualEntryDepartment={setManualEntryDepartment}
                    manualEntryYear={manualEntryYear}
                    setManualEntryYear={setManualEntryYear}
                />
            ) : (
                // Pass relevant state and handlers to UploadFile
                <UploadFile
                    selectedFile={selectedFile}
                    handleFileChange={handleFileChange}
                    handleUpload={handleUpload}
                />
            )}

            <div className="preview-section">
                <h2 className="preview-title">Preview</h2>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {['Name', 'Email', 'Role', 'Department', 'Year', 'Status'].map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {previewUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.department}</td>
                                    <td>{user.year}</td>
                                    <td>
                                        <span className={`status ${user.status === 'Valid' ? 'status-valid' : 'status-warning'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="action-buttons">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-confirm">Create Accounts</button>
            </div>
        </div>
    );
};

export default AccountCreation;