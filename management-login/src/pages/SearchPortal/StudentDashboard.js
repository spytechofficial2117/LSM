import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, LineChart, Line } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faPenToSquare, faCertificate } from '@fortawesome/free-solid-svg-icons';
import './StudentDashboard.css';

// This component uses dummy data for demonstration within the dashboard view.
const dummyStudentData = {
    universityRank: '#80',
    batchRank: '#30',
    score: '1200',
    percentageScore: '78.90',
    totalScore: 1200,
    totalChallenges: 90,
    totalSubmissions: 1600,
    totalTimeSpent: '3d 7hr 40min',
    successFailData: [
        { name: 'Success', value: 65, color: '#4CAF50' },
        { name: 'Partial', value: 20, color: '#FFC107' },
        { name: 'Fail', value: 15, color: '#F44336' },
    ],
    marksSummary: [
        { subject: 'Aptitude', score: 12345 },
        { subject: 'Verbal', score: 12345 },
        { subject: 'Reasoning', score: 12345 },
        { subject: 'C language', score: 12345 },
    ],
    questionsAttempted: [
        { date: 'Feb-3', questions: 10 },
        { date: 'Feb-4', questions: 12 },
        { date: 'Feb-5', questions: 15 },
        { date: 'Feb-6', questions: 13 },
        { date: 'Feb-7', questions: 18 },
        { date: 'Feb-8', questions: 20 },
        { date: 'Feb-9', questions: 22 },
    ],
    learningProgress: {
        problemsSolved: 800,
        longestStreak: '3 Days',
        certificates: '5',
    },
    activitiesData: [
        { name: 'Dec2', C: 10, Java: 8 },
        { name: 'Dec3', C: 12, Java: 10 },
        { name: 'Dec4', C: 8, Java: 6 },
        { name: 'Dec5', C: 11, Java: 9 },
        { name: 'Dec6', C: 13, Java: 11 },
    ],
};

const MetricCard = ({ label, value, icon, iconBgClass, iconTextClass }) => (
    <div className="summary-card">
        {icon && (
            <div className={`summary-icon-container ${iconBgClass} ${iconTextClass}`}>
                {icon}
            </div>
        )}
        <div className='label-value'>
            <p className="summary-label">{label}</p>
            <p className="summary-value">{value}</p>
        </div>
    </div>
);

function StudentDashboard({ student, onBackClick }) {
    const displayData = { ...dummyStudentData, ...student };
    const COLORS = displayData.successFailData.map(d => d.color);

    return (
        <div className="dashboard-container">
            <button className="btn btn-secondary back-button" onClick={onBackClick}>&larr; Back to List</button>
            
            <section className="card profile-section">
                <div className="profile-image-container">
                    <img src={displayData.imageUrl || `https://placehold.co/100x100/A8F374/333?text=${displayData.name.substring(0,2)}`} alt={displayData.name} className="profile-image" />
                </div>
                <div>
                    <h2 className="profile-name">{displayData.name}</h2>
                    <div className="profile-contact-info">
                        <span className="contact-item">
                            <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            {displayData.email}
                        </span>
                        <span className="contact-item">
                            <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.67-3.67A19.79 19.79 0 0 1 2 6.18 2 2 0 0 1 4.18 4h3a2 2 0 0 1 2 1.72l.44 4.51a2 2 0 0 1-1.28 2.12l-1.5 1.25a1 1 0 0 0-.3.73v.79a1 1 0 0 0 .56.89 10 10 0 0 0 4.19 4.19 1 1 0 0 0 .89.56h.79a1 1 0 0 0 .73-.3l1.25-1.5a2 2 0 0 1 2.12-1.28l4.51.44A2 2 0 0 1 22 16.92z"/></svg>
                            {displayData.phone || 'N/A'}
                        </span>
                    </div>
                </div>
            </section>
            {/* Other sections using displayData */}
        </div>
    );
}
export default StudentDashboard;