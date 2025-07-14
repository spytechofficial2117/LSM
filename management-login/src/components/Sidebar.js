import React from 'react';
import { NavLink } from 'react-router-dom';
import { SearchIcon, UserCog, PlusSquareIcon, KeyRoundIcon, RefreshCwIcon, XIcon } from './Icons';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Management</h2>
        <button onClick={toggleSidebar} className="sidebar-toggle-btn-close">
          <XIcon />
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/search-portal" className="nav-item">
          <SearchIcon className="nav-icon" />
          <span className="nav-text">Search Portal</span>
        </NavLink>

        <div className="nav-item has-submenu">
          <div className="nav-item-parent">
            <UserCog className="nav-icon" />
            <span className="nav-text">User Management</span>
          </div>
          <div className="submenu">
            <NavLink to="/user-management/account-creation" className="submenu-item">
              <PlusSquareIcon className="nav-icon" />
              <span className="nav-text">Account Creation</span>
            </NavLink>
            <NavLink to="/user-management/permission-modifications" className="submenu-item">
              <KeyRoundIcon className="nav-icon" />
              <span className="nav-text">Permissions</span>
            </NavLink>
            <NavLink to="/user-management/batch-updates" className="submenu-item">
              <RefreshCwIcon className="nav-icon" />
              <span className="nav-text">Batch Updates</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;