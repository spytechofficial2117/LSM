import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './AccountCreation.css';
import PageTitle from '../components/ui/PageTitle';
import TabButton from '../components/ui/TabButton';
import FormInput from '../components/ui/FormInput';
import CustomSelect from '../components/ui/CustomSelect';

const ManualEntry = ({
    manualEntryName, setManualEntryName,
    manualEntryEmail, setManualEntryEmail,
    manualEntryRole, setManualEntryRole,
    manualEntryDepartment, setManualEntryDepartment,
    manualEntryYear, setManualEntryYear
}) => {
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = ["Select year", "N/A"];
        for (let i = currentYear; i >= currentYear - 50; i--) {
            years.push(String(i));
        }
        return years;
    };

    return (
        <div className="form-grid">
            <FormInput
                label="Name"
                placeholder="Enter user's full name"
                value={manualEntryName}
                onChange={(e) => setManualEntryName(e.target.value)}
            />
            <FormInput
                label="Email"
                placeholder="Enter user's email address"
                value={manualEntryEmail}
                onChange={(e) => setManualEntryEmail(e.target.value)}
            />
            <CustomSelect
                label="Role"
                options={["Select user role", "Student", "Faculty", "Staff"]}
                value={manualEntryRole}
                onChange={(value) => setManualEntryRole(value)}
            />
            <CustomSelect
                label="Department"
                options={["Select Department", "Computer Science", "Mathematics", "Engineering", "Biology", "Arts", "Administration"]}
                value={manualEntryDepartment}
                onChange={(value) => setManualEntryDepartment(value)}
            />
            <CustomSelect
                label="Year"
                options={generateYears()}
                value={manualEntryYear}
                onChange={(value) => setManualEntryYear(value)}
            />
        </div>
    );
};

const UploadFile = ({ selectedFile, handleFileChange, fileInputRef }) => {
    const [isDragging, setIsDragging]= useState(false);
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };
    return(
    <div className="upload-box">
        <p className="upload-description">
            Upload a CSV or Excel file to create multiple accounts at once. Ensure the file includes columns for Name, Email, Role, Department, and Year.
        </p>
        <label className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
            <input
                ref={fileInputRef}
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
                {/* The "Upload File" button is removed as parsing happens on selection */}
            </div>
        )}
    </div>
    );
};

const AccountCreation = ({ addUser, addUsers, users, removeUsers }) => {
    const [activeTab, setActiveTab] = useState('manual');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedUsers, setUploadedUsers] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); // New state for selected rows in preview
    const fileInputRef = useRef(null);

    const [manualEntryName, setManualEntryName] = useState('');
    const [manualEntryEmail, setManualEntryEmail] = useState('');
    const [manualEntryRole, setManualEntryRole] = useState('Select user role');
    const [manualEntryDepartment, setManualEntryDepartment] = useState('Select department');
    const [manualEntryYear, setManualEntryYear] = useState('');

    const parseFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;

            try {
                if (file.name.endsWith('.csv')) {
                    Papa.parse(data, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                            // Map to expected keys, case-insensitively
                            const mappedData = results.data.map(row => ({
                                name: row.Name || row.name,
                                email: row.Email || row.email,
                                role: row.Role || row.role,
                                department: row.Department || row.department,
                                year: row.Year || row.year,
                            }));
                            setUploadedUsers(mappedData);
                        }
                    });
                } else if (file.name.endsWith('.xlsx')) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);
                    // Map to expected keys, case-insensitively
                    const mappedData = json.map(row => ({
                        name: row.Name || row.name,
                        email: row.Email || row.email,
                        role: row.Role || row.role,
                        department: row.Department || row.department,
                        year: row.Year || row.year,
                    }));
                    setUploadedUsers(mappedData);
                }
            } catch (error) {
                console.error("Error parsing file:", error);
                alert("There was an error parsing the file. Please check the format.");
                setUploadedUsers([]);
            }
        };

        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            parseFile(file);
            setSelectedRows([]); // Clear selection when a new file is uploaded
        }
    };

    const handleCreateAccount = () => {
        if (activeTab === 'manual') {
            if (
                manualEntryName.trim() &&
                manualEntryEmail.trim() &&
                manualEntryRole !== 'Select user role' &&
                manualEntryDepartment !== 'Select department' &&
                manualEntryYear
            ) {
                const newUser = {
                    name: manualEntryName,
                    email: manualEntryEmail,
                    role: manualEntryRole,
                    department: manualEntryDepartment,
                    year: manualEntryYear,
                };
                addUser(newUser);
                // Reset form
                setManualEntryName('');
                setManualEntryEmail('');
                setManualEntryRole('Select user role');
                setManualEntryDepartment('Select department');
                setManualEntryYear('');
            } else {
                alert('Please fill out all manual entry fields correctly.');
            }
        } else if (activeTab === 'upload') {
            if (uploadedUsers.length > 0) {
                addUsers(uploadedUsers);
                handleClearTable(); // Use clear table to reset state after creation
            } else {
                alert('No users from file to add. Please upload a valid file first.');
            }
        }
    };

    const handleCancel = () => {
      setManualEntryName('');
      setManualEntryEmail('');
      setManualEntryRole('Select user role');
      setManualEntryDepartment('Select department');
      setManualEntryYear('');

      setSelectedFile(null);
      setUploadedUsers([]);
      setSelectedRows([]); // Clear selection on cancel
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    };

    const handleClearTable = () => {
        setUploadedUsers([]); // Clear the uploaded users from the preview
        setSelectedFile(null); // Clear the selected file
        setSelectedRows([]); // Clear selection when table is cleared
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input element
        }
    };

    const handleToggleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all users currently displayed in the preview
            const allUserIds = previewData.map(user => user.id);
            setSelectedRows(allUserIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleToggleRowSelection = (userId) => {
        setSelectedRows(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleRemoveSelected = () => {
        if (selectedRows.length === 0) {
            alert('Please select at least one account to remove.');
            return;
        }

        // Filter out only the users that are actually in the `users` state
        // (i.e., accounts that have been created and persisted)
        const userIdsToRemoveFromApp = selectedRows.filter(id => users.some(user => user.id === id));

        if (userIdsToRemoveFromApp.length > 0) {
            removeUsers(userIdsToRemoveFromApp); // Call the removeUsers function from App.js
            alert(`${userIdsToRemoveFromApp.length} account(s) removed successfully.`);
        } else {
            alert('No created accounts selected for removal. Only accounts already created can be removed.');
        }

        // Clear selection and uploaded users (if applicable) regardless
        setSelectedRows([]);
        // If the removed users were part of the uploadedUsers preview, clear them too
        setUploadedUsers(prevUploaded => prevUploaded.filter(user => !selectedRows.includes(user.id)));
    };


    const previewData = activeTab === 'manual' ? users : [...users, ...uploadedUsers];

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

            {activeTab === 'manual' ? (
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
                <UploadFile
                    selectedFile={selectedFile}
                    handleFileChange={handleFileChange}
                    fileInputRef={fileInputRef}
                />
            )}

            <div className="preview-section">
                <h2 className="preview-title">Preview</h2>
                <div className="preview-scroll-wrapper">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={handleToggleSelectAll}
                                        checked={selectedRows.length === previewData.length && previewData.length > 0}
                                        disabled={previewData.length === 0}
                                    />
                                </th>
                                {['Name', 'Email', 'Role', 'Department', 'Year'].map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                                {/* Conditionally render Actions column header */}
                                {activeTab === 'upload' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.length > 0 ? (
                                previewData.map((user, index) => (
                                    <tr key={user.id || `preview-${index}`}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(user.id)}
                                                onChange={() => handleToggleRowSelection(user.id)}
                                            />
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.department}</td>
                                        <td>{user.year}</td>
                                        {/* Conditionally render the individual remove button */}
                                        {activeTab === 'upload' && !users.some(existingUser => existingUser.id === user.id) && (
                                            <td>
                                                <button
                                                    className="btn-remove-row"
                                                    onClick={() => {
                                                        // Remove from uploadedUsers state if it's not a created user
                                                        setUploadedUsers(prevUploaded => prevUploaded.filter(u => u.id !== user.id));
                                                        setSelectedRows(prevSelected => prevSelected.filter(id => id !== user.id));
                                                    }}
                                                    title="Remove from preview"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        )}
                                        {/* If activeTab is not 'upload' or user is already created, render an empty td to maintain column structure */}
                                        {(activeTab !== 'upload' || users.some(existingUser => existingUser.id === user.id)) && (
                                            <td></td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={activeTab === 'upload' ? "7" : "6"} style={{textAlign: 'center', padding: '20px'}}>No users to preview.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>

            <div className="action-buttons">
                <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
                {activeTab === 'upload' && uploadedUsers.length > 0 && (
                    <button className="btn-secondary" onClick={handleClearTable}>Clear Table</button>
                )}
                {selectedRows.length > 0 && (
                    <button className="btn-secondary" onClick={handleRemoveSelected}>Delete Selected</button>
                )}
                <button className="btn-confirm" onClick={handleCreateAccount}>Create Accounts</button>
            </div>
        </div>
    );
};
export default AccountCreation;
