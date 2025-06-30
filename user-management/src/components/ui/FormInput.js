import React from 'react';
import './FormInput.css';

const FormInput = ({ label, placeholder }) => (
    <div className="form-input">
        <label className="form-label">{label}</label>
        <input type="text"
         placeholder={placeholder} 
         className="input-box" 
         />

    </div>
);

export default FormInput;
