import React from 'react';
import './TabButton.css';

const TabButton = ({ text, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`tab-button ${isActive ? 'active' : ''}`}
    >
        {text}
    </button>
);

export default TabButton;
