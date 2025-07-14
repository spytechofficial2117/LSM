import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { MenuIcon } from './components/Icons';

// Pages
import SearchPortal from "./pages/SearchPortal/App";
import AccountCreation from './pages/UserManagement/pages/AccountCreation';
import PermissionModifications from './pages/UserManagement/pages/PermissionModifications';
import BatchUpdates from './pages/UserManagement/pages/BatchUpdates';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const location = useLocation();

  // Load users from localStorage on initial render
  useEffect(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(storedUsers);
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      setUsers([]);
    }
  }, []);

  // Persist users to localStorage whenever they change
  const persistUsers = (updatedUsers) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const addUser = (newUser) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, { id: `user-${Date.now()}-${Math.random()}`, status: 'Active', ...newUser }];
      persistUsers(updatedUsers);
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
      persistUsers(updatedUsers);
      return updatedUsers;
    });
  };

  const updateUsers = (updatedUsersList) => {
    persistUsers(updatedUsersList);
  };

  const removeUsers = (userIdsToRemove) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(user => !userIdsToRemove.includes(user.id));
      persistUsers(updatedUsers);
      return updatedUsers;
    });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/search-portal')) return 'Student Search Portal';
    if (path.startsWith('/user-management/account-creation')) return 'Account Creation';
    if (path.startsWith('/user-management/permission-modifications')) return 'Permission Modifications';
    if (path.startsWith('/user-management/batch-updates')) return 'Batch Updates';
    return 'Management Panel';
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-content">
        <header className="main-header">
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="sidebar-toggle-btn-open">
              <MenuIcon />
            </button>
          )}
          <h1 className="main-header-title">{getPageTitle()}</h1>
        </header>
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/search-portal" replace />} />
            <Route path="/search-portal" element={<SearchPortal />} />
            <Route path="/user-management/account-creation" element={<AccountCreation addUser={addUser} addUsers={addUsers} users={users} removeUsers={removeUsers} updateUsers={updateUsers} />} />
            <Route path="/user-management/permission-modifications" element={<PermissionModifications users={users} updateUsers={updateUsers} />} />
            <Route path="/user-management/batch-updates" element={<BatchUpdates users={users} updateUsers={updateUsers} removeUsers={removeUsers} />} />
            <Route path="*" element={<Navigate to="/search-portal" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;