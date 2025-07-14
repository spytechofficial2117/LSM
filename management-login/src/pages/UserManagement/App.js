import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import AccountCreation from './pages/AccountCreation';
import PermissionModifications from './pages/PermissionModifications';
import BatchUpdates from './pages/BatchUpdates';
import { PlusSquareIcon, KeyRoundIcon, RefreshCwIcon, MenuIcon, XIcon } from './components/Icons';

function UserManagementApp() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [users, setUsers] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    }, []);

    // Effect to handle resizing
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setIsSidebarOpen(true);
        } else {
          setIsSidebarOpen(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to close sidebar on navigation on smaller screens
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);


    const addUser = (newUser) => {
        setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers, { id: `user-${Date.now()}-${Math.random()}`, status: 'Active', ...newUser }];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return updatedUsers;
        });
    };

    const addUsers = (newUsers) => {
        setUsers((prevUsers) => {
            const usersToAdd = newUsers.map(user => ({
                ...user,
                id: `user-${Date.now()}-${Math.random()}`,
                status: 'Active'
            }));
            const updatedUsers = [...prevUsers, ...usersToAdd];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return updatedUsers;
        });
    };

    const updateUsers = (updatedUsersList) => {
        setUsers(updatedUsersList);
        localStorage.setItem('users', JSON.stringify(updatedUsersList));
    };

    const removeUsers = (userIdsToRemove) => {
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.filter(user => !userIdsToRemove.includes(user.id));
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return updatedUsers;
        });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // SidebarLink now uses NavLink for routing
    const SidebarLink = ({ to, icon, text }) => {
        return (
            <NavLink
                to={to}
                end // Use 'end' for the base route to avoid it matching all sub-routes
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
                {icon && React.createElement(icon, { className: 'sidebar-icon' })}
                {isSidebarOpen && <span>{text}</span>}
            </NavLink>
        );
    };

    return (
        <div className={`app-root ${isSidebarOpen && window.innerWidth <= 768 ? 'sidebar-open-overlay' : ''}`}>
             <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    {isSidebarOpen && <h1 className="sidebar-title">User Management</h1>}
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                        {isSidebarOpen ? <XIcon className="toggle-icon" /> : <MenuIcon className="toggle-icon" />}
                    </button>
                </div>
                {isSidebarOpen && (
                    <nav className="sidebar-links">
                        <SidebarLink to="" icon={PlusSquareIcon} text="Account Creation" />
                        <SidebarLink to="permissions" icon={KeyRoundIcon} text="Permission Modifications" />
                        <SidebarLink to="batch-updates" icon={RefreshCwIcon} text="Batch Updates" />
                    </nav>
                )}
            </aside>
            <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {!isSidebarOpen && (
                    <button className="main-content-toggle-btn" onClick={toggleSidebar}>
                        <MenuIcon className="toggle-icon" />
                    </button>
                )}
                <div className="decorative-circle top-right"></div>
                <div className="decorative-circle bottom-left"></div>
                <div className="content-inner">
                    <Routes>
                        <Route path="/" element={<AccountCreation addUser={addUser} addUsers={addUsers} users={users} removeUsers={removeUsers} updateUsers={updateUsers} />} />
                        <Route path="permissions" element={<PermissionModifications users={users} updateUsers={updateUsers} />} />
                        <Route path="batch-updates" element={<BatchUpdates users={users} updateUsers={updateUsers} removeUsers={removeUsers} />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default UserManagementApp;