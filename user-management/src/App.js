import React, { useState, useEffect } from 'react';
import './App.css';
import AccountCreation from './pages/AccountCreation';
import PermissionModifications from './pages/PermissionModifications';
import BatchUpdates from './pages/BatchUpdates';
import { PlusSquareIcon, KeyRoundIcon, RefreshCwIcon, MenuIcon } from './components/Icons';

export default function App() {
    const [currentPage, setCurrentPage] = useState('accountCreation');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]); // State to hold user data

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    }, []);

    const addUser = (newUser) => {
        setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers, { id: `user-${Date.now()}-${Math.random()}`, status: 'Active', ...newUser }];
            localStorage.setItem('users', JSON.stringify(updatedUsers)); // Persist data
            return updatedUsers;
        });
    };

    const addUsers = (newUsers) => {
        setUsers((prevUsers) => {
            const usersToAdd = newUsers.map(user => ({
                ...user,
                id: `user-${Date.now()}-${Math.random()}`, // Assign unique IDs
                status: 'Active'
            }));
            const updatedUsers = [...prevUsers, ...usersToAdd];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return updatedUsers;
        });
    };

    const updateUsers = (updatedUsersList) => {
        setUsers(updatedUsersList);
        localStorage.setItem('users', JSON.stringify(updatedUsersList)); // Persist data
    };

    // New function to remove users
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

    const SidebarLink = ({ pageName, icon, text }) => {
        const isActive = currentPage === pageName;
        return (
            <button
                onClick={() => setCurrentPage(pageName)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
                {icon && React.createElement(icon, { className: 'sidebar-icon' })}
                {isSidebarOpen && <span>{text}</span>}
            </button>
        );
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'accountCreation':
                return <AccountCreation addUser={addUser} addUsers={addUsers} users={users} removeUsers={removeUsers} />;
            case 'permissionModifications':
                return <PermissionModifications users={users} updateUsers={updateUsers} />;
            case 'batchUpdates':
                return <BatchUpdates users={users} updateUsers={updateUsers} />;
            default:
                return <AccountCreation addUser={addUser} addUsers={addUsers} users={users} removeUsers={removeUsers} />;
        }
    };

    return (
        <div className={`app-root ${isSidebarOpen ? 'sidebar-open-overlay' : ''}`}>
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-title">User Management</h1>
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                        <MenuIcon className="toggle-icon" />
                    </button>
                </div>
                <nav className="sidebar-links">
                    <SidebarLink pageName="accountCreation" icon={PlusSquareIcon} text="Account creation" />
                    <SidebarLink pageName="permissionModifications" icon={KeyRoundIcon} text="Permission modifications" />
                    <SidebarLink pageName="batchUpdates" icon={RefreshCwIcon} text="Batch updates" />
                </nav>
            </aside>
            <main className="main-content">
                {!isSidebarOpen && (
                    <button className="main-content-toggle-btn" onClick={toggleSidebar}>
                        <MenuIcon className="toggle-icon" />
                    </button>
                )}
                <div className="decorative-circle top-right"></div>
                <div className="decorative-circle bottom-left"></div>
                <div className="content-inner">{renderPage()}</div>
            </main>
        </div>
    );
}
