import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire , faPenToSquare, faCertificate} from '@fortawesome/free-solid-svg-icons';
// --- Dummy Data (Kept for structure) ---
const dummyStudentData = {
    name: 'Default name',
    email: 'johndoe@gmail.com',
    phone: '9077887743',
    imageUrl: 'https://placehold.co/100x100/A8F374/333?text=JD',
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
        { date: '9.00 Feb-3', questions: 10 },
        { date: '10.00 Feb-4', questions: 12 },
        { date: '11.00 Feb-5', questions: 15 },
        { date: '12.00 Feb-6', questions: 13 },
        { date: '13.00 Feb-7', questions: 18 },
        { date: '14.00 Feb-8', questions: 20 },
        { date: '15.00 Feb-9', questions: 22 },
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

// MetricCard component for reusability
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

function StudentDashboard({ student: propStudent, onBack }) { // Receive onBack prop
    // Merge the actual student data with dummy data to ensure all properties exist
    // Properties from propStudent will override dummyStudentData
    const student = {
        ...dummyStudentData,
        ...propStudent,
        // For nested objects/arrays, you might need deeper merges if partial updates are expected
        // For now, assuming if propStudent has a key like 'successFailData', it's the complete one.
        successFailData: propStudent.successFailData || dummyStudentData.successFailData,
        marksSummary: propStudent.marksSummary || dummyStudentData.marksSummary,
        questionsAttempted: propStudent.questionsAttempted || dummyStudentData.questionsAttempted,
        learningProgress: {
            ...dummyStudentData.learningProgress,
            ...(propStudent.learningProgress || {})
        },
        activitiesData: propStudent.activitiesData || dummyStudentData.activitiesData,
    };

    // COLORS variable is necessary for PieChart
    const COLORS = student.successFailData.map(d => d.color);

    return (
        <div className="dashboard-container">
            {/* Back Button - now inside the dashboard component */}
            {onBack && (
                <button onClick={onBack} className='back-button'>
                    &larr;
                </button>
            )}

            {/* Top Header Section */}
            <header>
                <div className="header-logo">LOGO</div>
            </header>

            {/* Student Profile Section */}
            <section className="card profile-section">
                <div className="profile-image-container">
                    <img src={student.imageUrl} alt={student.name} className="profile-image" />
                </div>
                <div>
                    <h2 className="profile-name">{student.name}</h2>
                    <div className="profile-contact-info">
                        <span className="contact-item">
                            {/* Mail icon */}
                            <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            {student.email}
                        </span>
                        <span className="contact-item">
                            {/* Phone icon */}
                            <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.67-3.67A19.79 19.79 0 0 1 2 6.18 2 2 0 0 1 4.18 4h3a2 2 0 0 1 2 1.72l.44 4.51a2 2 0 0 1-1.28 2.12l-1.5 1.25a1 1 0 0 0-.3.73v.79a1 1 0 0 0 .56.89 10 10 0 0 0 4.19 4.19 1 1 0 0 0 .89.56h.79a1 1 0 0 0 .73-.3l1.25-1.5a2 2 0 0 1 2.12-1.28l4.51.44A2 2 0 0 1 22 16.92z"/></svg>
                            {student.phone}
                        </span>
                    </div>
                </div>
            </section>

            {/* Key Metrics Cards */}
            <section className="summary-cards-grid">
                <MetricCard
                    label="University rank"
                    value={student.universityRank}
                    icon={<svg className="summary-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10s-7.53 4.54-9.06 6.07C11.5 17.61 10 18.52 7.7 18.52a6.83 6.83 0 0 1-4.7-2.02c-1.3-.9-2.1-2.1-2.1-3.4 0-1.2.5-2.2 1.4-2.9C3.7 9.58 5 8.7 6 7.5c1.4-1.7 2.2-3.4 2.2-4.4 0-.6-.3-1.1-.6-1.5-.4-.4-.8-.7-1.3-.7s-.9.2-1.2.5c-.3.4-.6.8-.8 1.4-.2.6-.3 1.2-.3 1.8 0 .8.2 1.5.5 2.1l-.9.9c-.6.6-1.1 1.2-1.4 1.9s-.4 1.5-.4 2.2c0 .8.3 1.5.8 2.1 1.1 1.1 2.5 1.8 4 1.8s2.9-.7 4-1.8c1.1-1.1 1.8-2.5 1.8-4 0-.8-.2-1.5-.5-2.1l.9-.9c.6-.6 1.1-1.2 1.4-1.9s.4-1.5.4-2.2c0-.8-.3-1.5-.8-2.1z"/></svg>}
                    iconBgClass="bg-blue-100"
                    iconTextClass="text-blue-600"
                />
                <MetricCard
                    label="Batch rank"
                    value={student.batchRank}
                    icon={<svg className="summary-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87L16 14a4 4 0 0 0-3 3.87v2"/><path d="M19 7c1.49 0 2.87.87 3.5 2C21.13 10.87 19.75 11.74 18.25 11.74"/></svg>}
                    iconBgClass="bg-green-100"
                    iconTextClass="text-green-600"
                />
                <MetricCard
                    label="Score"
                    value={student.score}
                    icon={<svg className="summary-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                    iconBgClass="bg-yellow-100"
                    iconTextClass="text-yellow-600"
                />
                <MetricCard
                    label="Percentage Score"
                    value={`${student.percentageScore}%`}
                    icon={<svg className="summary-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>}
                    iconBgClass="bg-purple-100"
                    iconTextClass="text-purple-600"
                />
            </section>

            {/* Combined Overall Stats, Success Vs Fail & Marks Summary into one card */}
            <section className="card main-stats-charts-section"> {/* New main container class */}
                {/* Overall Stats */}
                <div className="overall-stats-sub-section"> {/* Sub-section for overall stats */}
                    <h3 className="section-title">Overall Stats</h3>
                    <div className="overall-stats-grid-new"> {/* Reusing the grid for layout */}
                        <div className="stat-item-new">
                            <p className="label">Total Score</p>
                            <p className="value">{student.totalScore}</p>
                        </div>
                        <div className="stat-item-new">
                            <p className="label">Total Challenges</p>
                            <p className="value">{student.totalChallenges}</p>
                        </div>
                        <div className="stat-item-new">
                            <p className="label">Total Submissions</p>
                            <p className="value">{student.totalSubmissions}</p>
                        </div>
                        <div className="stat-item-new">
                            <p className="label">Total Time Spent</p>
                            <p className="value">{student.totalTimeSpent}</p>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <hr className="section-divider" /> {/* New divider element */}

                {/* Charts Row: Success Vs Fail & Marks Summary */}
                <div className="charts-and-summary-grid"> {/* Grid for side-by-side charts */}
                    {/* Success Vs Fail Chart */}
                    <div className='chart-container chart-pie-specific'>
                        <h3 className="section-title">Success Vs Fail</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={student.successFailData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    labelLine={false}
                                >
                                    {student.successFailData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="horizontal"
                                    align="center"
                                    verticalAlign="bottom"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Marks Summary */}
                    <div className="marks-summary-container chart-marks-specific">
                        <h3 className="section-title">Marks Summary</h3>
                        <div className="marks-list">
                            {student.marksSummary.map((item, index) => (
                                <div key={index} className="marks-summary-item">
                                    <span className="subject">{item.subject}</span>
                                    <span className="score">{item.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Questions Attempted Chart */}
            <section className="card">
                <h3 className="section-title">Questions Attempted</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={student.questionsAttempted}
                        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false}  label={{ value: 'Time/Duration', position: 'bottom', offset: 0, fill: '#6b7280' }}/>
                        <YAxis axisLine={false} tickLine={false}  label={{ value: 'Questions', angle: -90, position: 'insideLeft', fill: '#6b7280' }}/>
                        <Tooltip />
                        {/* <Legend /> */}
                        <Line type="monotone" dataKey="questions" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </section>

            {/* Learning Progress and Languages Used Section */}
            <section className="grid-2-col">
                {/* Learning Progress */}
                <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
                    <h3 className="section-title">Learning progress</h3>
                    <div className="learning-progress-grid">
                        <div className="progress-item">
                            <div className='progress-icon-circle blue'>
                                <FontAwesomeIcon icon={faPenToSquare} style={{fontSize:"30px"}} />
                            </div>
                            <span className="progress-label">Problems solved</span>
                            <span className="progress-value">{student.learningProgress.problemsSolved}</span>
                        </div>
                        <div className="progress-item">
                            <div className="progress-icon-circle orange">
                                <FontAwesomeIcon icon={faFire} style={{fontSize:'30px'}}/>
                            </div>
                            <span className="progress-label">Longest Streak</span>
                            <span className="progress-value">{student.learningProgress.longestStreak}</span>
                        </div>
                        <div className="progress-item">
                            <div className="progress-icon-circle blue">
                               <FontAwesomeIcon icon={faCertificate} style={{fontSize:'30px', color:'#74C0FC'}} />
                            </div>
                            <span className="progress-label">Certificates</span>
                            <span className="progress-value">{student.learningProgress.certificates}</span>
                        </div>
                    </div>
                </div>

                {/* Languages Used Chart */}
                <div className="card">
                    <h3 className="section-title">Languages used</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={student.activitiesData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                            <YAxis axisLine={false} tickLine={false}/>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="C" stackId="a" fill="#3B82F6" barSize={20} radius={[0, 0, 0, 0]} /> {/* Colors added for visual distinction */}
                            <Bar dataKey="Java" stackId="a" fill="#FF8C00" barSize={20} radius={[10, 10, 0, 0]} /> {/* Colors added for visual distinction */}
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="chart-footer-label">Activities</p>
                </div>
            </section>
        </div>
    );
}

export default StudentDashboard;