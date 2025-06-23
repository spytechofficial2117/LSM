import React, { useState, useRef } from 'react';
import './BatchUpdates.css';
import PageTitle from '../components/ui/PageTitle';
import FormSelect from '../components/ui/FormSelect';
import { mockUsers, mockUpdateHistory } from '../data/mockData';
import { SearchIcon } from '../components/Icons';

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
}) => {
  const searchContainerRef = useRef(null);

  const getSelectedUserDetails = (userId) => {
    return mockUsers.find(user => user.id === userId);
  };

  return (
    <div>
      <div className="filter-box">
        <h3 className="filter-title">Filter Users</h3>
        <div className="filter-grid">
          <FormSelect label="" options={["Select Department", "Engineering", "Arts", "Science"]} />
          <FormSelect label="" options={["Select Year", "1", "2", "3"]} />
          <FormSelect label="" options={["Select Section", "A", "B", "C"]} />
          <FormSelect label="" options={["Select Role", "Student", "Faculty"]} />
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
              }, 150); // Increased timeout slightly for robustness
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
            {mockUsers.map(user => (
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
                  <span className={`status ${user.status === 'Active' ? 'status-valid' : 'status-inactive'}`}>
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

// --- Component 2: Upload Sheet Interface ---
const UploadUpdateSheet = ({ selectedFile, handleFileChange, handleUpload }) => (
  <div>
    <div className="upload-box">
      <h3 className="filter-title">Upload CSV or Excel File</h3>
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
            {mockUpdateHistory.map(item => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>{item.affected}</td>
                <td>
                  <span className="status status-valid">{item.status}</span>
                </td>
                <td><button className="btn-secondary small">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Main Component: Batch Updates ---
const BatchUpdates = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      const filtered = mockUsers.filter(user =>
        !selectedUsers.includes(user.id) &&
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
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`Uploading: ${selectedFile.name}`);
    }
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
        />
      ) : (
        <UploadUpdateSheet
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default BatchUpdates;