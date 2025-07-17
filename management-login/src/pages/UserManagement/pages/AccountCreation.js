import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './AccountCreation.css';
import PageTitle from '../components/ui/PageTitle';
import TabButton from '../components/ui/TabButton';
import FormInput from '../components/ui/FormInput';
import CustomSelect from '../components/ui/CustomSelect';
import { useUsers } from '../../../context/UserContext'; // Import the context hook

const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = ["Select year", "N/A"];
    for (let i = currentYear; i >= currentYear - 50; i--) {
        years.push(String(i));
    }
    return years;
};
const ManualEntry = ({
    manualEntryName, setManualEntryName,
    manualEntryEmail, setManualEntryEmail,
    manualEntryRole, setManualEntryRole,
    manualEntryDepartment, setManualEntryDepartment,
    manualEntryYear, setManualEntryYear
}) => {
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
    const [isDragging, setIsDragging] = useState(false);
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };
    return (
        <div className="upload-box">
            <p className="upload-description">
                Upload a CSV or Excel file to create multiple accounts at once. Ensure the file includes columns for Name, Email, Role, Department, and Year.
            </p>
            <label className={`upload-dropzone ${isDragging ? 'dragging' : ''}`} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden-input" onChange={handleFileChange} />
                <div className="dropzone-content">
                    <p className="dropzone-title">Drag and drop file here</p>
                    <p className="dropzone-sub">or click to select CSV/Excel file</p>
                </div>
            </label>
            {selectedFile && ( <div className="upload-actions"><p className="file-name">Selected: {selectedFile.name}</p></div> )}
        </div>
    );
};

const AccountCreation = () => {
    // Get state and functions from the context
    const { users, addUsers, removeUsers, updateUsers } = useUsers();
    
    const [activeTab, setActiveTab] = useState('manual');
    const [selectedFile, setSelectedFile] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const fileInputRef = useRef(null);
    const [isCreationComplete, setIsCreationComplete] = useState(false);
    const [manualEntryName, setManualEntryName] = useState('');
    const [manualEntryEmail, setManualEntryEmail] = useState('');
    const [manualEntryRole, setManualEntryRole] = useState('Select user role');
    const [manualEntryDepartment, setManualEntryDepartment] = useState('Select Department');
    const [manualEntryYear, setManualEntryYear] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});

    const parseFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            let parsedData = [];
            if (file.name.endsWith('.csv')) {
                Papa.parse(data, {
                    header: true, skipEmptyLines: true,
                    complete: (results) => {
                        parsedData = results.data.map(row => ({ id: `temp-${Date.now()}-${Math.random()}`, name: row.Name || row.name, email: row.Email || row.email, role: row.Role || row.role, department: row.Department || row.department, year: row.Year || row.year, }));
                        setPendingUsers(prev => [...prev, ...parsedData]);
                    }
                });
            } else if (file.name.endsWith('.xlsx')) {
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                parsedData = json.map(row => ({ id: `temp-${Date.now()}-${Math.random()}`, name: row.Name || row.name, email: row.Email || row.email, role: row.Role || row.role, department: row.Department || row.department, year: row.Year || row.year, }));
                setPendingUsers(prev => [...prev, ...parsedData]);
            }
        };
        if (file.name.endsWith('.csv')) { reader.readAsText(file); } else { reader.readAsBinaryString(file); }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setSelectedFile(file); parseFile(file); setSelectedRows([]); setIsCreationComplete(false); }
    };
    const handleAddSingleUser = (e) => {
        e.preventDefault();
        if (manualEntryName.trim() && manualEntryEmail.trim() && manualEntryRole !== 'Select user role' && manualEntryDepartment !== 'Select department' && manualEntryYear) {
            const newUser = { id: `temp-${Date.now()}-${Math.random()}`, name: manualEntryName, email: manualEntryEmail, role: manualEntryRole, department: manualEntryDepartment, year: manualEntryYear, };
            setPendingUsers(prev => [...prev, newUser]);
            setManualEntryName(''); setManualEntryEmail(''); setManualEntryRole('Select user role'); setManualEntryDepartment('Select Department'); setManualEntryYear('');
        } else { alert('Please fill out all manual entry fields correctly.'); }
    };
    const handleCreateAccount = () => {
        if (pendingUsers.length > 0) {
            addUsers(pendingUsers);
            setPendingUsers([]);
            alert(`${pendingUsers.length} account(s) created successfully.`);
            setIsCreationComplete(true);
        } else { alert('No accounts to create. Please add users via manual entry or file upload.'); }
    };
    const handleCancel = () => {
        setManualEntryName(''); setManualEntryEmail(''); setManualEntryRole('Select user role'); setManualEntryDepartment('Select Department'); setManualEntryYear('');
        setSelectedFile(null);
        if (fileInputRef.current) { fileInputRef.current.value = ""; }
        setPendingUsers([]); setSelectedRows([]); setEditingUserId(null); setEditedUserData({});
    };
    const handleClearPendingUsers = () => {
        setPendingUsers([]); setSelectedRows([]); setSelectedFile(null);
        if (fileInputRef.current) { fileInputRef.current.value = ""; }
    };
    const handleToggleSelectAll = (e) => {
        if (e.target.checked) {
            const allUserIds = previewData.map(user => user.id);
            setSelectedRows(allUserIds);
        } else { setSelectedRows([]); }
    };
    const handleToggleRowSelection = (userId) => {
        setSelectedRows(prevSelected => prevSelected.includes(userId) ? prevSelected.filter(id => id !== userId) : [...prevSelected, userId]);
    };
    const handleRemoveSelected = () => {
        if (selectedRows.length === 0) { alert('Please select at least one account to remove.'); return; }
        const userIdsToRemoveFromApp = selectedRows.filter(id => users.some(user => user.id === id));
        const userIdsToRemoveFromPending = selectedRows.filter(id => pendingUsers.some(user => user.id === id));
        if (userIdsToRemoveFromApp.length > 0) { removeUsers(userIdsToRemoveFromApp); alert(`${userIdsToRemoveFromApp.length} created account(s) removed successfully.`); }
        if (userIdsToRemoveFromPending.length > 0) { setPendingUsers(prevPending => prevPending.filter(user => !userIdsToRemoveFromPending.includes(user.id))); alert(`${userIdsToRemoveFromPending.length} preview account(s) removed successfully.`); }
        setSelectedRows([]);
    };
    const handleEditClick = (user) => { setEditingUserId(user.id); setEditedUserData({ ...user }); };
    const handleSaveEdit = () => {
        if (!editedUserData.name.trim() || !editedUserData.email.trim() || editedUserData.role === 'Select user role' || editedUserData.department === 'Select department' || !editedUserData.year) {
            alert('Please fill out all fields for the edited user.'); return;
        }
        const isExistingUser = users.some(u => u.id === editedUserData.id);
        if (isExistingUser) {
            const updatedUsersList = users.map(user => user.id === editedUserData.id ? { ...user, ...editedUserData } : user);
            updateUsers(updatedUsersList);
            alert(`Account for ${editedUserData.name} updated successfully.`);
        } else {
            setPendingUsers(prevPending => prevPending.map(user => user.id === editedUserData.id ? { ...user, ...editedUserData } : user));
            alert(`Preview account for ${editedUserData.name} updated.`);
        }
        setEditingUserId(null); setEditedUserData({});
    };
    const handleCancelEdit = () => { setEditingUserId(null); setEditedUserData({}); };
    
    const previewData = [...users, ...pendingUsers];
    const numColumns = 5 + (pendingUsers.length > 0 ? 2 : 0);

    return (
        <div className="account-creation">
            <PageTitle
                title="Create Accounts"
                subtitle="Manually add users or upload a CSV/Excel file to create multiple accounts at once."
            />
            <div className="tab-header">
                <TabButton text="Manual Entry" isActive={activeTab === 'manual'} onClick={() => setActiveTab('manual')} />
                <TabButton text="Upload File" isActive={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
            </div>
            {activeTab === 'manual' ? (
                <ManualEntry
                    manualEntryName={manualEntryName} setManualEntryName={(v) => { setManualEntryName(v); setIsCreationComplete(false); }}
                    manualEntryEmail={manualEntryEmail} setManualEntryEmail={(v) => { setManualEntryEmail(v); setIsCreationComplete(false); }}
                    manualEntryRole={manualEntryRole} setManualEntryRole={(v) => { setManualEntryRole(v); setIsCreationComplete(false); }}
                    manualEntryDepartment={manualEntryDepartment} setManualEntryDepartment={(v) => { setManualEntryDepartment(v); setIsCreationComplete(false); }}
                    manualEntryYear={manualEntryYear} setManualEntryYear={(v) => { setManualEntryYear(v); setIsCreationComplete(false); }}
                />
            ) : (
                <UploadFile selectedFile={selectedFile} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
            )}
            {activeTab === 'manual' && ( <div className="action-buttons-manual"><button className="btn-primary" onClick={handleAddSingleUser}>Add to Preview</button></div> )}
            <div className="preview-section">
                <h2 className="preview-title">Current Accounts Preview</h2>
                <div className="preview-scroll-wrapper">
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {pendingUsers.length > 0 && (<th><input type="checkbox" onChange={handleToggleSelectAll} checked={selectedRows.length === previewData.length && previewData.length > 0} disabled={previewData.length === 0} /></th>)}
                                    {['Name', 'Email', 'Role', 'Department', 'Year'].map(header => (<th key={header}>{header}</th>))}
                                    {pendingUsers.length > 0 && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.length > 0 ? (
                                    previewData.map((user, index) => {
                                        const isExistingUser = users.some(existingUser => existingUser.id === user.id);
                                        return (
                                            <tr key={user.id || `preview-${index}`}>
                                                {pendingUsers.length > 0 && (<td><input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => handleToggleRowSelection(user.id)} /></td>)}
                                                {editingUserId === user.id ? (
                                                    <>
                                                        <td><FormInput value={editedUserData.name} onChange={e => setEditedUserData(prev => ({ ...prev, name: e.target.value }))} /></td>
                                                        <td><FormInput value={editedUserData.email} onChange={e => setEditedUserData(prev => ({ ...prev, email: e.target.value }))} /></td>
                                                        <td><CustomSelect value={editedUserData.role} options={["Student", "Faculty", "Staff"]} onChange={value => setEditedUserData(prev => ({ ...prev, role: value }))} /></td>
                                                        <td><CustomSelect value={editedUserData.department} options={["Computer Science", "Mathematics", "Engineering", "Biology", "Arts", "Administration"]} onChange={value => setEditedUserData(prev => ({ ...prev, department: value }))} /></td>
                                                        <td><CustomSelect value={editedUserData.year} options={generateYears()} onChange={value => setEditedUserData(prev => ({ ...prev, year: value }))} /></td>
                                                        <td className="action-buttons-cell"><button className="btn-confirm small" onClick={handleSaveEdit}>Save</button><button className="btn-secondary small" onClick={handleCancelEdit}>Cancel</button></td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.department}</td><td>{user.year}</td>
                                                        {pendingUsers.length > 0 && (
                                                            <td className="action-buttons-cell">
                                                                <button className="btn-edit-row" onClick={() => handleEditClick(user)} title={isExistingUser ? "Created accounts cannot be edited here." : "Edit this account"} disabled={isExistingUser}>Edit</button>
                                                                <button className="btn-remove-row" onClick={() => { setPendingUsers(prevPending => prevPending.filter(u => u.id !== user.id)); alert(`Preview account for ${user.name} removed.`); setSelectedRows(prevSelected => prevSelected.filter(id => id !== user.id)); }} title={isExistingUser ? "Created accounts cannot be removed here." : "Remove this account"} disabled={isExistingUser}>Remove</button>
                                                            </td>
                                                        )}
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : ( <tr><td colSpan={numColumns} style={{ textAlign: 'center', padding: '20px' }}>No users to preview.</td></tr> )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="action-buttons">
                <button className="btn-secondary" onClick={handleCancel} disabled={isCreationComplete}>Cancel</button>
                {pendingUsers.length > 0 && (<button className="btn-secondary" onClick={handleClearPendingUsers}>Clear Pending Users</button>)}
                {selectedRows.length > 0 && pendingUsers.length > 0 && (<button className="btn-secondary" onClick={handleRemoveSelected}>Delete Selected</button>)}
                <button className="btn-confirm" onClick={handleCreateAccount} disabled={pendingUsers.length === 0 || isCreationComplete}>Create Accounts</button>
            </div>
        </div>
    );
};

export default AccountCreation;
