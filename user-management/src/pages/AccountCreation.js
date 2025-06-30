import React, { useState } from 'react';
import './AccountCreation.css';
import PageTitle from '../components/ui/PageTitle';
import TabButton from '../components/ui/TabButton';
import FormInput from '../components/ui/FormInput';
// import FormSelect from '../components/ui/FormSelect';
import CustomSelect from '../components/ui/CustomSelect';
const AccountCreation = () => {
    const [activeTab, setActiveTab] = useState('manual');
    const [previewUsers] = useState([
        { name: 'Ethan Harper', email: 'ethan.harper@example.com', role: 'Student', department: 'Computer Science', year: 'Sophomore', status: 'Valid' },
        { name: 'Olivia Bennett', email: 'olivia.bennett@example.com', role: 'Teacher', department: 'Engineering', year: 'N/A', status: 'Valid' },
        { name: 'Liam Carter', email: 'liam.carter@example.com', role: 'Student', department: 'Arts', year: 'Freshman', status: 'Duplicate' },
    ]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [manualEntryName, setManualEntryName] = useState('');
    const [manualEntryEmail, setManualEntryEmail] = useState('');
    const [manualEntryRole, setManualEntryRole] = useState('Select user role'); // Default value
    const [manualEntryDepartment, setManualEntryDepartment] = useState('Select department'); // Default value
    const [manualEntryYear, setManualEntryYear] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            alert(`Uploading: ${selectedFile.name}`);
        }
    };
     const handleNameChange = (e) => {
        setManualEntryName(e.target.value);
    };
     const handleEmailChange = (e) => {
        setManualEntryEmail(e.target.value);
    };
      const handleRoleChange = (e) => { // This handler will now be used by CustomSelect
        setManualEntryRole(e.target.value);
    };

    const handleDepartmentChange = (e) => { // This handler will now be used by CustomSelect
        setManualEntryDepartment(e.target.value);
    };
    const handleYearChange = (e) => {
    const year = e.target.value;
    setManualEntryYear(year);
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = ["Select year", "N/A"];
        for (let i = currentYear; i >= currentYear - 50; i--) { // Generates years from current year down to 100 years ago
            years.push(String(i));
        }
        return years;
    };
    const ManualEntry = () => (
        <div className="form-grid">
            <FormInput label="Name" placeholder="Enter user's full name"  value={manualEntryName} onChange={handleNameChange}/>
            <FormInput label="Email" placeholder="Enter user's email address" value={manualEntryEmail} onChange={handleEmailChange}/>
            {/* <FormSelect label="Role" options={["Select user role", "Student", "Faculty", "Staff"]} />
            <FormSelect label="Department" options={["Select department", "Computer Science", "Mathematics", "Engineering", "Biology", "Arts", "Administration"]} /> */}
            {/* <FormSelect label="Year" options={["Select year", "2023", "2024", "2025", "N/A"]} /> */}
            <CustomSelect
                label="Role"
                options={["Select user role", "Student","Faculty","Staff"]}
                value={manualEntryRole}
                onChange={handleRoleChange}
            />
            <CustomSelect
                label="Department"
                options={["Select Department","computer Science","Mathematics", "Engineering","Biology","Arts","Administration"]}
                value={manualEntryDepartment}
                onChange={handleDepartmentChange}
                />
            <CustomSelect
                label="Year"
                options={generateYears()}
                value={manualEntryYear}
                onChange={handleYearChange}
                // className="year-select" // No longer needed for CustomYearSelect itself for width control
            />
        </div>
    );

    const UploadFile = () => (
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

    return (
        <div className="account-creation">
            <PageTitle title="Create Accounts" subtitle="Manually add users or upload a CSV/Excel file to create multiple accounts at once." />
            <div className="tab-header">
                <TabButton text="Manual Entry" isActive={activeTab === 'manual'} onClick={() => setActiveTab('manual')} />
                <TabButton text="Upload File" isActive={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
            </div>

            {activeTab === 'manual' ? <ManualEntry /> : <UploadFile />}

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
