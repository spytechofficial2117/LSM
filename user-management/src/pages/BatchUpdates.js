// src/pages/BatchUpdates.js
import React, { useState, useRef, useEffect} from 'react';
import './BatchUpdates.css';
import PageTitle from '../components/ui/PageTitle';
import CustomSelect from '../components/ui/CustomSelect'; // Using CustomSelect instead of FormSelect
import { SearchIcon } from '../components/Icons';

// Import parsing libraries
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
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
    dynamicDropdownOptions, // NEW PROP: options from uploaded file
    // Filter state and handlers for the dropdowns (to be implemented in parent if needed)
    // For now, these are just placeholders using empty onChange functions
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
}) => {
    const searchContainerRef = useRef(null);
    const getSelectedUserDetails = (userId) => {
        return users.find(user => user.id === userId);
    };
    return (
        <div>
            <div className="filter-box">
                <h3 className="filter-title">Filter Users</h3>
                <div className="filter-grid">
                    <CustomSelect
                       
                        label="Department"
                        options={dynamicDropdownOptions.Department}
                        value={selectedDepartmentFilter} // Assuming a state for this in parent
                        onChange={(value) => setSelectedDepartmentFilter(value)} // Assuming a handler
             
                    />
                    <CustomSelect
                        label="Year"
                        options={dynamicDropdownOptions.Year}
                        value={selectedYearFilter} 
                        onChange={(value) => setSelectedYearFilter(value)} // Assuming a handler
                    />
                    <CustomSelect
                       
                        label="Section"
                        // Assuming 'Section' is also provided by your CSV/Excel.
                        options={dynamicDropdownOptions.Section}
                        value={selectedSectionFilter} // Assuming a state for this in parent
                        onChange={(value) => setSelectedSectionFilter(value)} // Assuming a handler
                    />
                  
                    <CustomSelect
                        label="Role"
                        options={dynamicDropdownOptions.Role}
                        value={selectedRoleFilter} // Assuming a state for this in parent
                  
                        onChange={(value) => setSelectedRoleFilter(value)} // Assuming a handler
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
  
                            {searchResults.length > 0 ? (
                                searchResults.slice(0, 5).map(user => (
                                   
                                    <li
                                        key={user.id}
                                        className="suggestion-item"
                   
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                 
                                            handleSuggestionClick(user);
                                        }}
                                    >
             
                                        {highlightMatch(user.name, searchQuery)} – {highlightMatch(user.email, searchQuery)}
                                    </li>
                                ))
 
                            ) : (
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

            <div className="table-container">
                <table className="data-table">
                    <thead>
  
                        <tr>
                            <th><input type="checkbox" /></th>
                            {["Name", "Email", "Role", "Department", "Year", "Status", "Actions"].map(header => (
            
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
       
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : ''}>
                           
                                <td>
                                    <input
                                        type="checkbox"
                   
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => {
                                     
                                            setSelectedUsers(prev =>
                                                prev.includes(user.id)
                                            
                                                    ? prev.filter(id => id !== user.id)
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
                                    <span className={`status ${user.status === 
                                        'Active' ? 'status-valid' : 'status-inactive'}`}>
                                        {user.status}
                                    </span>
                    
                                </td>
                                <td className="action-cell">Edit</td>
                            </tr>
                        ))}
   
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-confirm">Apply changes</button>
       
            </div>
        </div>
    );
};
const UploadUpdateSheet = ({ selectedFile, handleFileChange, setDynamicDropdownOptions }) => {
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

// --- Main Component: Batch Updates ---
const BatchUpdates = ({ users, updateUsers }) => {
    const [activeTab, setActiveTab] = useState('upload');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // NEW STATE for dynamic dropdown options from the uploaded file
    const [dynamicDropdownOptions, setDynamicDropdownOptions] = useState({
        Department: ["Select Department"],
        Role: ["Select Role"],
        Year: ["Select Year", "N/A"],
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
                    dynamicDropdownOptions={dynamicDropdownOptions} // Pass dynamic options here
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