import React from 'react';
import './FormSelect.css';
const FormSelect = ({ label, options }) => (
    <div className="form-select">
        <label className="form-label">{label}</label>
        <select className="select-box">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);
export default FormSelect;