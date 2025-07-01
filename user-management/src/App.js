import React, { useState } from 'react';
import './App.css';
import AccountCreation from './pages/AccountCreation';
import PermissionModifications from './pages/PermissionModifications';
import BatchUpdates from './pages/BatchUpdates';
import { PlusSquareIcon, KeyRoundIcon, RefreshCwIcon, MenuIcon } from './components/Icons';

export default function App() {
    const [currentPage, setCurrentPage] = useState('accountCreation');
    const [isSidebarOpen, setIsSidebarOpen]= useState(false);

    const toggleSidebar = ()=>{
        setIsSidebarOpen( prev => !prev);
    };

    const SidebarLink = ({ pageName, icon, text }) => {
        const isActive = currentPage === pageName;
        return (
            <button
                onClick={() => setCurrentPage(pageName)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
                {React.createElement(icon, { className: 'sidebar-icon' })}
                {isSidebarOpen && <span>{text}</span>}
            </button>
        );
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'accountCreation':
                return <AccountCreation />;
            case 'permissionModifications':
                return <PermissionModifications />;
            case 'batchUpdates':
                return <BatchUpdates />;
            default:
                return <AccountCreation />;
        }
    };

    return (
       <div className={`app-root ${isSidebarOpen ? 'sidebar-open-overlay' : ''}`}>
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                <h1 className="sidebar-title"> User Management</h1>
                <button className='sidebar-toggle-btn' onClick={toggleSidebar}>
               <MenuIcon className="toggle-icon"></MenuIcon>
                </button>
                </div>
                <nav className="sidebar-links">
                    <SidebarLink pageName="accountCreation" icon={PlusSquareIcon} text="Account creation" />
                    <SidebarLink pageName="permissionModifications" icon={KeyRoundIcon} text="Permission modifications" />
                    <SidebarLink pageName="batchUpdates" icon={RefreshCwIcon} text="Batch updates" />
                </nav>
            </aside>

            {/* Main Content */}
             <main className= "main-content">
                    {!isSidebarOpen && (
                    <button className="content-toggle-btn" onClick={toggleSidebar}>
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
