import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import AccountCreation from './pages/AccountCreation';
import PermissionModifications from './pages/PermissionModifications';
import BatchUpdates from './pages/BatchUpdates';
import { PlusSquareIcon, KeyRoundIcon, RefreshCwIcon, MenuIcon, XIcon } from './components/Icons';
import { UserContext } from '../../context/UserContext'; // added

function UserManagementApp() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [users, setUsers] = useState([]);
    const location = useLocation();
    const { users: globalUsers, setUsers: setGlobalUsers } = useContext(UserContext); // added

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth > 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    const addUser = (newUser) => {
        setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers, { id: `user-${Date.now()}-${Math.random()}`, ...newUser }];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setGlobalUsers(updatedUsers); // sync with context
            return updatedUsers;
        });
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