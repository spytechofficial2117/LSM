import React from 'react';
import './PageTitle.css';
const PageTitle = ({ title, subtitle }) => (
    <div className="page-title">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
    </div>
);
export default PageTitle;