import React, { useState, useEffect, useRef } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ label, options, value, onChange, className, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => setIsOpen(prev => !prev);

    const handleOptionClick = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayValue = options.find(option => option === value) || (value || "Select an option");

    return (
        <div className={`form-group ${className || ''}`} ref={dropdownRef}>
            {label && <label className="custom-select-label">{label}</label>}
            <div className={`custom-select-trigger ${isOpen ? 'open' : ''} ${error ? 'error-border' : ''}`} onClick={handleToggle}>
                {displayValue}
                <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
            </div>
            {isOpen && (
                <div className="custom-select-options">
                    {options.map((option) => (
                        <div key={option} className={`custom-select-option ${option === value ? 'selected' : ''}`} onClick={() => handleOptionClick(option)}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;