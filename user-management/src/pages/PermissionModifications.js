import React, { useState, useEffect } from 'react';
import './PermissionModifications.css';
import PageTitle from '../components/ui/PageTitle';
import CustomSelect from '../components/ui/CustomSelect';

const PermissionModifications = ({ users, updateUsers }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState({});
    const [permissionRole, setPermissionRole]= useState('Select user role');
    const [permissionDepartment, setPermissionDepartment]= useState('Select Department');
    const [permissionYear, setPermissionYear]= useState('Select year');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handlePermissionRoleChange = (value) => {
        setPermissionRole(value);
    };
    const handlePermissionDepartmentChange = (value) => {
        setPermissionDepartment(value);
    };
    const handlePermissionYearChange = (value) => {
        setPermissionYear(value);
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = ["Select year", "N/A"];
        for (let i = currentYear; i >= currentYear - 50; i--) {
            years.push(String(i));
        }
        return years;
    };

    const toggleUserSelection = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
        );
    };

    const togglePermissionSelection = (permission) => {
        setSelectedPermissions(prev =>
            prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
        );
    };

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setSelectedPermissions([]);
            return;
        }

        if (selectedUsers.length === 1) {
            const userId = selectedUsers[0];
            setSelectedPermissions(userPermissions[userId] || []);
            return;
        }

        const firstUserPermissions = userPermissions[selectedUsers[0]] || [];
        const commonPermissions = firstUserPermissions.filter(permission =>
            selectedUsers.slice(1).every(userId =>
                (userPermissions[userId] || []).includes(permission)
            )
        );
        setSelectedPermissions(commonPermissions);

    }, [selectedUsers, userPermissions]);


    const handleApplyChanges = () => {
        if (selectedUsers.length === 0) {
            alert('Please select at least one user.');
            return;
        }

        setUserPermissions(prevPermissions => {
            const newPermissions = { ...prevPermissions };
            selectedUsers.forEach(userId => {
                newPermissions[userId] = [...selectedPermissions];
            });
            return newPermissions;
        });

        alert(`Applying the following permissions: ${selectedPermissions.join(', ') || 'None'} to ${selectedUsers.length} user(s).`);

        setSelectedPermissions([]);
        setSelectedUsers([]);
    };

    const permissions = ["View-only", "Edit Access", "Admin control"];
     useEffect(() => {
        let currentFilteredUsers = users;

        if (permissionRole !== 'Select user role') {
            currentFilteredUsers = currentFilteredUsers.filter(user => user.role === permissionRole);
        }

        if (permissionDepartment !== 'Select Department') {
            currentFilteredUsers = currentFilteredUsers.filter(user => user.department === permissionDepartment);
        }

        if (permissionYear !== 'Select year') {
            currentFilteredUsers = currentFilteredUsers.filter(user => {
                return String(user.year) === permissionYear;
            });
        }

        setFilteredUsers(currentFilteredUsers);
        setSelectedUsers([]);

    }, [permissionRole, permissionDepartment, permissionYear, users]);

    return (
        <div className="permission-mod-page">
            <PageTitle
                title="Permission Modifications"
                subtitle="Modify permissions for selected users."
            />

            <div className="filter-box">
                <h3 className="filter-title">Filter Users</h3>
                <div className="filter-grid">
                    <CustomSelect
                        label="Role"
                        options={["Select user role", "Student","Faculty","Staff"]}
                        value={permissionRole}
                        onChange={handlePermissionRoleChange}
                    />
                    <CustomSelect
                        label="Department"
                        options={["Select Department","Computer Science","Mathematics", "Engineering","Biology","Arts","Administration"]}
                        value={permissionDepartment}
                        onChange={handlePermissionDepartmentChange}
                    />
                    <CustomSelect
                        label="Year"
                        options={generateYears()}
                        value={permissionYear}
                        onChange={handlePermissionYearChange}
                    />
                </div>
            </div>

            <div className="user-table-wrapper">
                <h3 className="section-title">Select Users</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox"
                                 onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedUsers(filteredUsers.map(u=> u.id));
                                    } else {
                                        setSelectedUsers([]);
                                    }
                                }}
                                checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                disabled={filteredUsers.length === 0}
                                /></th>
                                {['Name', 'Role', 'Department', 'Year'].map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
                                        />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.department}</td>
                                    <td>{user.year}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='5' style={{textAlign: 'center', padding: '20px'}} >No users found matching the selected filters.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="permission-controls">
                <h3 className="section-title">Assign/Revoke Permissions</h3>
                <div className="permission-buttons">
                    {permissions.map(permission => (
                        <button
                            key={permission}
                            className={`btn ${selectedPermissions.includes(permission) ? 'btn-selected' : 'btn-secondary'}`}
                            onClick={() => togglePermissionSelection(permission)}
                        >
                            {permission}
                        </button>
                    ))}
                </div>
            </div>

            <div className="action-buttons">
                <button className="btn-confirm" onClick={handleApplyChanges}>Apply changes</button>
            </div>
        </div>
    );
};
export default PermissionModifications;