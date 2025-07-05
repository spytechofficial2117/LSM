// src/pages/BatchUpdates.js
import React, { useState, useRef, useEffect} from 'react';
import './BatchUpdates.css';
import './AccountCreation.css'; // Import styles for buttons
import PageTitle from '../components/ui/PageTitle';
import CustomSelect from '../components/ui/CustomSelect';
// Using CustomSelect instead of FormSelect
import FormInput from '../components/ui/FormInput'; // Import for inline editing
import { SearchIcon } from '../components/Icons';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
// Helper function from AccountCreation to generate years
const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = ["Select year", "N/A"];
    for (let i = currentYear; i >= currentYear - 50; i--) {
        years.push(String(i));
    }
    return years;
};

const highlightMatch = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
        <>
            {text.slice(0, index)}
            <mark className="highlight">{text.slice(index, index + query.length)}</mark>
            {text.slice(index + query.length)}
        </>
    );
};

// --- Component 1: Bulk Edit Interface ---
const BulkEditInterface = ({
    selectedUsers,
    setSelectedUsers,
    searchQuery,
    handleSearch,
    isSearchFocused,
    setIsSearchFocused,
    searchResults,
    handleSuggestionClick,
    dynamicDropdownOptions,
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
    selectedYearFilter,
    setSelectedYearFilter,
    selectedSectionFilter,
    setSelectedSectionFilter,
    selectedRoleFilter,
    setSelectedRoleFilter,
    filteredUsers,
    users,
    updateUsers, 
    removeUsers,
}) => {
  
    const searchContainerRef = useRef(null);
    // State for inline editing
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});
    // State for bulk update values
    const [bulkUpdateValues, setBulkUpdateValues] = useState({
        role: '',
        department: '',
        year: '',
        status: '',
    });
    const getSelectedUserDetails = (userId) => {
        return users.find(user => user.id === userId);
    };
    // Handlers for inline editing
    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setEditedUserData({ ...user });
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditedUserData({});
    };
    const handleSaveEdit = () => {
        const updatedUsersList = users.map(user =>
            user.id === editingUserId ? editedUserData : user
        );
        updateUsers(updatedUsersList);
        handleCancelEdit(); // Reset editing state
    };
    // Handler for "Select All" checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };
    // New handler for the main cancel button
    const handleCancel = () => {
        setSelectedUsers([]);
    };

    // Handler for applying bulk updates
    const handleApplyBulkChanges = () => {
        if (selectedUsers.length === 0) {
            alert("Please select users to update.");
            return;
        }

        const updatedUsersList = users.map(user => {
            if (selectedUsers.includes(user.id)) {
                // Create a copy to modify
                const updatedUser = { ...user };
                // Update fields only if a new value is selected in bulk form
  
                if (bulkUpdateValues.role) updatedUser.role = bulkUpdateValues.role;
                if (bulkUpdateValues.department) updatedUser.department = bulkUpdateValues.department;
                if (bulkUpdateValues.year) updatedUser.year = bulkUpdateValues.year;
                if (bulkUpdateValues.status) updatedUser.status = bulkUpdateValues.status;
                return updatedUser;
     
             }
            return user;
        });
        updateUsers(updatedUsersList);
        alert(`Applied changes to ${selectedUsers.length} user(s).`);
        
        // Reset state
        setSelectedUsers([]);
        setBulkUpdateValues({ role: '', department: '', year: '', status: '' });
    };
    
    // NEW: Handler for the "Edit Selected" button
    const handleEditSelected = () => {
        // This can be used to trigger a modal or scroll to the edit form.
        // For now, it serves as a placeholder.
        alert(`Editing options for ${selectedUsers.length} users are visible in the "Bulk Update Actions" section.`);
    };

    // Handler for bulk deletion
    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected user(s)?`)) {
            removeUsers(selectedUsers);
            setSelectedUsers([]);
        }
    };


    return (
        <div>
            <div className="filter-box">
                <h3 className="filter-title">Filter Users</h3>
                <div className="filter-grid">
                    <CustomSelect
                 
                         label="Department"
                        options={dynamicDropdownOptions.Department}
                        value={selectedDepartmentFilter}
                        onChange={(value) => setSelectedDepartmentFilter(value)}
                     />
                    <CustomSelect
                        label="Year"
                        options={dynamicDropdownOptions.Year}
                        value={selectedYearFilter} 
                         onChange={(value) => setSelectedYearFilter(value)}
                    />
                    <CustomSelect
                        label="Section"
                
                         options={dynamicDropdownOptions.Section}
                        value={selectedSectionFilter}
                        onChange={(value) => setSelectedSectionFilter(value)}
                    />
                    <CustomSelect
  
                         label="Role"
                        options={dynamicDropdownOptions.Role}
                        value={selectedRoleFilter}
                        onChange={(value) => setSelectedRoleFilter(value)}
    
                     />
                </div>

                <div className="search-container" ref={searchContainerRef}>
                    <SearchIcon className="search-icon" />
                    <input
        
                         type="text"
                        placeholder="Search users"
                        className="search-input"
                        value={searchQuery}
                         onChange={handleSearch}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                            setTimeout(() => {
     
                                 if (searchContainerRef.current && !searchContainerRef.current.contains(document.activeElement)) {
                                    setIsSearchFocused(false);
                                 }
                            }, 150);
                        }}
                    />
                    {searchQuery && isSearchFocused && (
                        <ul className="search-suggestions">
                            {searchResults.length > 0 
                            ? (
                                searchResults.slice(0, 5).map(user => (
                                    <li
                            
                                     key={user.id}
                                        className="suggestion-item"
                                        onMouseDown={(e) => {
      
                                             e.preventDefault();
                                            handleSuggestionClick(user);
                  
                                         }}
                                    >
                                        {highlightMatch(user.name, searchQuery)} 
                                         – {highlightMatch(user.email, searchQuery)}
                                    </li>
                                ))
                            ) : 
                            (
                                <li className="suggestion-item no-match">No user found</li>
                            )}
                        </ul>
            
                     )}
                </div>

                {selectedUsers.length > 0 && (
                    <div className="selected-users-chips">
                         <h4>Selected Users:</h4>
         
                         {selectedUsers.map(userId => {
                            const user = getSelectedUserDetails(userId);
                            return user ? (
                                <span key={user.id} className="user-chip">
                                    {user.name}
                           
                                     <button
                                        className="remove-chip-button"
                                        onClick={() => setSelectedUsers(prev => prev.filter(id => id !== userId))}
                                      >
                                        &times;
                           
                                     </button>
                                </span>
                            ) : null;
                        })}
                    </div>
                )}
            </div>

            {/* Bulk Update Section - Appears when users are selected */}
            {selectedUsers.length > 0 && (
              
                 <div className="filter-box">
                    <h3 className="filter-title">Bulk Update Actions for {selectedUsers.length} User(s)</h3>
                    <div className="filter-grid">
                         <CustomSelect
                         
                             label="Set New Role"
                            options={['', ...dynamicDropdownOptions.Role.slice(1)]}
                            value={bulkUpdateValues.role}
                            onChange={(value) => setBulkUpdateValues(prev => ({ ...prev, role: value }))}
  
                         />
                         <CustomSelect
                            label="Set New Department"
                       
                             options={['', ...dynamicDropdownOptions.Department.slice(1)]}
                            value={bulkUpdateValues.department}
                            onChange={(value) => setBulkUpdateValues(prev => ({ ...prev, department: value }))}
                         />
     
                          <CustomSelect
                            label="Set New Year"
                            options={['', ...dynamicDropdownOptions.Year.slice(1)]}
                     
                             value={bulkUpdateValues.year}
                            onChange={(value) => setBulkUpdateValues(prev => ({ ...prev, year: value }))}
                         />
                         <CustomSelect
       
                              label="Set New Status"
                            options={['', 'Active', 'Inactive']}
                            value={bulkUpdateValues.status}
                   
                             onChange={(value) => setBulkUpdateValues(prev => ({ ...prev, status: value }))}
                         />
                    </div>
                </div>
            )}

          
                 <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>
        
                                 <input 
                                    type="checkbox"
                                    onChange={handleSelectAll}
   
                                     checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                />
                            </th>
 
                             {["Name", "Email", "Role", "Department", "Year", "Status", "Actions"].map(header => (
                                <th key={header}>{header}</th>
                            ))}
    
                         </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
              
                             <tr key={user.id} className={selectedUsers.includes(user.id) ?
                             'selected-row' : ''}>
                                {editingUserId === user.id ?
                                (
                                    <>
                                        <td></td>
                        
                                         <td><FormInput value={editedUserData.name} onChange={e => setEditedUserData(prev => ({ ...prev, name: e.target.value }))} /></td>
                                        <td><FormInput value={editedUserData.email} onChange={e => setEditedUserData(prev => ({ ...prev, email: e.target.value }))} /></td>
                      
                                         <td><CustomSelect value={editedUserData.role} options={dynamicDropdownOptions.Role} onChange={value => setEditedUserData(prev => ({ ...prev, role: value }))} /></td>
                                        <td><CustomSelect value={editedUserData.department} options={dynamicDropdownOptions.Department} onChange={value => setEditedUserData(prev => ({ ...prev, department: value }))} /></td>
                  
                                         <td><CustomSelect value={editedUserData.year} options={generateYears()} onChange={value => setEditedUserData(prev => ({ ...prev, year: value }))} /></td>
                                        <td><CustomSelect value={editedUserData.status} options={["Active", "Inactive"]} onChange={value => setEditedUserData(prev => ({ ...prev, status: value }))} /></td>
             
                                         <td className="action-buttons-cell">
                                            <button className="btn-confirm small" onClick={handleSaveEdit}>Save</button>
                         
                                             <button className="btn-secondary small" onClick={handleCancelEdit}>Cancel</button>
                                        </td>
                                    </>
  
                               ) : (
                                    <>
                                
                                         <td>
                                            <input
                                                
                                                 type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                 onChange={() => {
 
                                                     setSelectedUsers(prev =>
                                               
                                                           prev.includes(user.id)
                                                            ?
                                                            prev.filter(id => id !== user.id)
                                                            : [...prev, user.id]
                                  
                                                     );
                                                 }}
                                            />
                                        </td>
                
                                         <td>{user.name}</td>
                                        <td>{user.email}</td>
                                    
                                         <td>{user.role}</td>
                                        <td>{user.department}</td>
                                        <td>{user.year}</td>
                
                                         <td>
                                            <span className={`status ${user.status === 'Active' ?
                                            'status-valid' : 'status-inactive'}`}>
                                                {user.status}
                                            </span>
      
                                           </td>
                                        <td className="action-buttons-cell">
                         
                                             <button className="btn-edit-row" onClick={() => handleEditClick(user)}>Edit</button>
                                            <button className="btn-remove-row" onClick={() => {
                             
                                                 if (window.confirm(`Are you sure you want to delete user: ${user.name}?`)) {
                                                    removeUsers([user.id]);
                                                 }
                                            }}>Delete</button>
                                        </td>
                
                                     </>
                                )}
                            </tr>
                    
                         ))}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button className="btn-secondary" onClick={handleCancel}>Cancel</button>

                {/* MODIFIED: "Edit Selected" and "Delete Selected" buttons are now conditionally rendered */}
                {selectedUsers.length > 1 && (
                    <>
                        <button className="btn-secondary" onClick={handleEditSelected}>
                            Edit Selected
                        </button>
                        <button className="btn-secondary" onClick={handleDeleteSelected}>
                            Delete Selected
                        </button>
                    </>
                )}

                <button className="btn-confirm" onClick={handleApplyBulkChanges} disabled={selectedUsers.length === 0}>
                    Apply Edits
                </button>
             </div>
        </div>
    );
};

// --- Component 2: Upload Update Sheet (no changes here) ---
const UploadUpdateSheet = ({ selectedFile, handleFileChange, setDynamicDropdownOptions }) => {
    // ... (rest of component is unchanged)
    const [isDragging, setIsDragging] = useState(false);
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
    const handleInternalUpload = () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            let parsedData = [];
            let headers = [];

            if (selectedFile.name.endsWith('.csv')) {
                Papa.parse(data, {
                    header: true, // Treat first row as headers
                    skipEmptyLines: true,
                    complete: (results) => {
  
                         parsedData = results.data;
                        headers = results.meta.fields; // Get headers from PapaParse
                        extractAndSetOptions(parsedData, headers);
                    
                     },
                    error: (error) => {
                        console.error("Error parsing CSV:", error);
                        alert("Error parsing CSV file. Please check the format.");
                   
                     }
                });
            } else if (selectedFile.name.endsWith('.xlsx')) {
                try {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    
                    parsedData = XLSX.utils.sheet_to_json(worksheet);
                    extractAndSetOptions(parsedData, Object.keys(parsedData[0] || {}));
                } catch (error) {
                    console.error("Error parsing XLSX:", error);
                    alert("Error parsing Excel file. Please check the format.");
                }
            } else {
                alert("Unsupported file type. Please upload a CSV or XLSX file.");
                return;
            }
        };

        reader.readAsBinaryString(selectedFile);
    };
    const extractAndSetOptions = (data, headers) => {
        const departments = new Set();
        const roles = new Set();
        const years = new Set();
        const sections = new Set();
        data.forEach(row => {
            if (row.Department) departments.add(row.Department);
            if (row.Role) roles.add(row.Role);
            if (row.Year) years.add(row.Year);
            if (row.Section) sections.add(row.Section); 
        });
        const dynamicOptions = {
            Department: ['Select Department', ...Array.from(departments).sort()],
            Role: ['Select Role', ...Array.from(roles).sort()],
            Year: ['Select Year', 'N/A', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))], // Sort years descending numerically
            Section: ['Select Section', ...Array.from(sections).sort()], // Sort sections
      
        };
        setDynamicDropdownOptions(dynamicOptions); // Update parent state
        alert("File parsed and dropdown options updated!");
    };
    return (
        <div>
            <div className="upload-box">
                <h3 className="filter-title">Upload CSV or Excel File</h3>
                <label className= {`upload-dropzone ${isDragging? 'dragging' : ''}`}
                  onDragEnter={handleDragEnter}
                 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
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
                       
                          <button className="btn-primary upload-button" onClick={handleInternalUpload}>
                            Upload File
                         </button>
                    </div>
                )}
     
             </div>

            <div>
                 <h2 className="history-title">Update History</h2>
                <div className="table-container">
                    <table className="data-table">
                        
                         <thead>
                             <tr>
                                {["Date", "Update Type", "Affected Users", "Status", "Details"].map(header => (
                               
                                     <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
          
                         <tbody>
                            {/* Mock data removed */}
                        </tbody>
                     </table>
         
                  </div>
            </div>
        </div>
    );
};


// --- Main Component: Batch Updates (no changes here) ---
const BatchUpdates = ({ users, updateUsers, removeUsers }) => {
    // ... (rest of component is unchanged)
    const [activeTab, setActiveTab] = useState('bulkEdit');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dynamicDropdownOptions, setDynamicDropdownOptions] = useState({
        Department: ["Select Department", "Computer Science", "Mathematics", "Engineering", "Biology", "Arts", "Administration"],
        Role: ["Select Role", "Student", "Faculty", "Staff"],
        Year: ["Select Year", "N/A", ...generateYears().slice(2)],
        Section: ["Select Section"]
    });
    const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('Select Department');
    const [selectedYearFilter, setSelectedYearFilter] = useState('Select Year');
    const [selectedSectionFilter, setSelectedSectionFilter] = useState('Select Section');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('Select Role');
    const[filteredUsers, setFilteredUsers]= useState(users);
    
    useEffect( ()=>{
         let currentFilteredUsers = users;

        if (selectedDepartmentFilter !== 'Select Department') {
            currentFilteredUsers = currentFilteredUsers.filter(user =>
                user.department === selectedDepartmentFilter
            );
        }
        if (selectedYearFilter !== 'Select Year') 
        {
            currentFilteredUsers = currentFilteredUsers.filter(user =>
                String(user.year) === selectedYearFilter 
            );
        }
        if (selectedSectionFilter !== 'Select Section') {
            currentFilteredUsers = currentFilteredUsers.filter(user =>
         
                user.section === 
                selectedSectionFilter
            );
        }
        if (selectedRoleFilter !== 'Select Role') {
            currentFilteredUsers = currentFilteredUsers.filter(user =>
                user.role === selectedRoleFilter
         
             );
        }

        setFilteredUsers(currentFilteredUsers);
    }, [selectedDepartmentFilter, selectedYearFilter, selectedSectionFilter, selectedRoleFilter, users]);
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 0) {
            const filtered = filteredUsers.filter(user=>!selectedUsers.includes(user.id) &&
                (
                    user.name.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase())
                )
       
             );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    };
    
    const handleSuggestionClick = (user) => {
        if (!selectedUsers.includes(user.id)) {
            setSelectedUsers(prev => [...prev, user.id]);
        }
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchFocused(false);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setDynamicDropdownOptions({
            Department: ["Select Department"],
            Role: ["Select Role"],
            Year: ["Select Year", "N/A"],
            Section: ["Select Section"]
        });
        setSelectedDepartmentFilter('Select Department');
        setSelectedYearFilter('Select Year');
        setSelectedSectionFilter('Select Section');
        setSelectedRoleFilter('Select Role');
    };

    return (
        <div className="batch-updates">
            <PageTitle title="Batch Updates" subtitle="Perform bulk updates to user roles, departments, or academic years." />
            <div className="tab-header">
                <button className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Upload Update Sheet</button>
              
                 <button className={`tab-button ${activeTab === 'bulkEdit' ? 'active' : ''}`} onClick={() => setActiveTab('bulkEdit')}>Bulk Edit Interface</button>
            </div>
            {activeTab === 'bulkEdit' ? (
                <BulkEditInterface
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
 
                     searchQuery={searchQuery}
                    handleSearch={handleSearch}
                    isSearchFocused={isSearchFocused}
                    setIsSearchFocused={setIsSearchFocused}
                    searchResults={searchResults}
 
                     handleSuggestionClick={handleSuggestionClick}
                    dynamicDropdownOptions={dynamicDropdownOptions}
                    selectedDepartmentFilter={selectedDepartmentFilter}
                     setSelectedDepartmentFilter={setSelectedDepartmentFilter}
                    
                     selectedYearFilter={selectedYearFilter}
                    setSelectedYearFilter={setSelectedYearFilter}
                    selectedSectionFilter={selectedSectionFilter}
                     setSelectedSectionFilter={setSelectedSectionFilter}
                    selectedRoleFilter={selectedRoleFilter}
                   
                     setSelectedRoleFilter={setSelectedRoleFilter}
                    filteredUsers={filteredUsers}
                     users={users}
                    updateUsers={updateUsers}
                    removeUsers={removeUsers}
                />
  
             ) : (
                <UploadUpdateSheet
                    selectedFile={selectedFile}
                    handleFileChange={handleFileChange}
                    setDynamicDropdownOptions={setDynamicDropdownOptions} // Pass the setter function
       
                 />
            )}
        </div>
    );
};

export default BatchUpdates;