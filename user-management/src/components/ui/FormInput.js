import React from 'react';
import './FormInput.css';

const FormInput = ({ label, placeholder,value,onChange}) => (
    <div className="form-input">
        <label className="form-label">{label}</label>
        <input type="text"
         placeholder={placeholder} 
         className="input-box" 
         value={value}
         onChange={onChange}
         />

    </div>
);

export default FormInput;
