import React from "react";

import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import "./StudentDashboard.css";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const StudentDashboard = ({ student, onBackClick }) => {

  if (!student) {
    return <div className="no-data">No student data available.</div>;
  }

  // --- Chart Data ---

  // Data for Success vs Fail Donut Chart
  const successFailData = {
    labels: ["Success", "Partial", "Fail"],
    datasets: [
      {
        data: [
          student.successCount || 120,
          student.partialCount || 30,
          student.failCount || 10,
        ],
        backgroundColor: ["#56E9B3", "#EBF374", "#e74c3c"],
        borderColor: ["#FEFEFA"],
        borderWidth: 4,
        hoverOffset: 4,
      },
    ],
  };

  // Data for Questions Attempted Line Chart
  const questionsAttemptedData = {
    labels: ["Feb-3", "Feb-4", "Feb-5", "Feb-6", "Feb-7", "Feb-8", "Feb-9"],
    datasets: [
      {
        label: "Questions",
        data: [10, 12, 15, 13, 18, 20, 22],
        fill: false,
        borderColor: "#4a4b3c",
        backgroundColor: "#CBE220",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  // Data for Languages Used Bar Chart
  const languagesUsedData = {
    labels: ["Dec2", "Dec3", "Dec4", "Dec5", "Dec6"],
    datasets: [
      {
        label: "C",
        data: [11, 12, 5, 12, 13],
        backgroundColor: "#56E9B3",
      },
      {
        label: "Java",
        data: [7, 9, 8, 8, 10],
        backgroundColor: "#CBE220",
      },
    ],
  };

  // --- Component JSX ---

  return (
    <div className="dashboard-container">
      <button onClick={onBackClick} className="btn-back">
        &larr; Back to Student List
      </button>

      {/* Header Section */}
      <header className="dashboard-header">
        <div className="logo-placeholder">LOGO</div>
        <div className="student-identity">
          <img
            src={
              student.imageUrl ||
              `https://api.dicebear.com/6.x/initials/svg?seed=${
                student.name || "S"
              }`
            }
            alt="profile avatar"
            className="profile-avatar"
          />
          <div className="student-details">
            <h1 className="student-name-header">{student.name}</h1>
            <p>
              {student.email} | {student.contact}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Stats Cards */}
      <div className="quick-stats-grid">
        <div className="stat-card-small">
          <p className="stat-title">University rank</p>
          <p className="stat-value">#{student.universityRank || 80}</p>
        </div>
        <div className="stat-card-small">
          <p className="stat-title">Batch rank</p>
          <p className="stat-value">#{student.batchRank || 30}</p>
        </div>
        <div className="stat-card-small">
          <p className="stat-title">Score</p>
          <p className="stat-value">{student.score || 1200}</p>
        </div>
        <div className="stat-card-small">
          <p className="stat-title">Percentage Score</p>
          <p className="stat-value">{student.percentageScore || 78.9}%</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="main-dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col">
          <div className="stat-card large-card">
            <h2 className="card-title">Overall Stats</h2>
            <div className="overall-stats-grid">
              <div>
                <p className="stat-title">Total Score</p>
                <p className="stat-value">{student.totalScore || 1200}</p>
              </div>
              <div>
                <p className="stat-title">Total Challenges</p>
                <p className="stat-value">{student.totalChallenges || 90}</p>
              </div>
              <div>
                <p className="stat-title">Total Submissions</p>
                <p className="stat-value">{student.totalSubmissions || 1600}</p>
              </div>
              <div>
                <p className="stat-title">Total Time Spent</p>
                <p className="stat-value">{student.timeSpent || "3d 7hr 40m"}</p>
              </div>
            </div>
          </div>
          <div className="chart-card">
            <h2 className="card-title">Success vs Fail</h2>
            <div className="chart-wrapper-donut">
              <Doughnut data={successFailData} options={{ maintainAspectRatio: false }}/>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-col">
          <div className="stat-card large-card">
            <h2 className="card-title">Marks Summary</h2>
            <ul className="marks-summary-list">
              <li><span>Aptitude</span><span>{student.aptitude || 12345}</span></li>
              <li><span>Verbal</span><span>{student.verbal || 12345}</span></li>
              <li><span>Reasoning</span><span>{student.reasoning || 12345}</span></li>
              <li><span>C language</span><span>{student.cLanguage || 12345}</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row-grid">
        <div className="chart-card">
          <h2 className="card-title">Questions Attempted</h2>
          <div className="chart-wrapper">
             <Line data={questionsAttemptedData} options={{ maintainAspectRatio: false }}/>
          </div>
        </div>
        <div className="stat-card">
            <h2 className="card-title">Learning Progress</h2>
            <div className="learning-progress-grid">
                 <div>
                    <p className="stat-title">Problems solved</p>
                    <p className="stat-value">{student.problemsSolved || 800}</p>
                </div>
                <div>
                    <p className="stat-title">Longest Streak</p>
                    <p className="stat-value">{student.longestStreak || 3} Days</p>
                </div>
                <div>
                    <p className="stat-title">Certificates</p>
                    <p className="stat-value">{student.certificates || 5}</p>
                </div>
            </div>
        </div>
         <div className="chart-card">
            <h2 className="card-title">Languages Used</h2>
            <div className="chart-wrapper">
                <Bar data={languagesUsedData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true }}}}/>
            </div>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;

