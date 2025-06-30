
import React, { useState, useEffect, useRef } from 'react';
import './CustomSelect.css'; 

const CustomSelect = ({ label, options, value, onChange, className, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Used to detect clicks outside the dropdown

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleOptionClick = (optionValue) => {
        // Simulate an event object like a native <select> onChange
        onChange(optionValue);
        setIsOpen(false); // Close the dropdown after selection
    };

    // Effect to close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

    // Determine what to display in the trigger
    const displayValue = options.find(option => option === value) || (value || "Select year");

    return (
        <div className={`form-group ${className || ''}`} ref={dropdownRef}>
            <label className="custom-select-label">{label}</label>
            <div
                className={`custom-select-trigger ${isOpen ? 'open' : ''} ${error ? 'error-border' : ''}`}
                onClick={handleToggle}
            >
                {displayValue}
                <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
            </div>

            {isOpen && (
                <div className="custom-select-options">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`custom-select-option ${option === value ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;