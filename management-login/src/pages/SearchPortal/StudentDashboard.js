import React from "react";
import "./StudentDashboard.css";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const StudentDashboard = ({ student }) => {
  if (!student) {
    return <div className="no-data">No student data available.</div>;
  }

  const completedCredits = parseInt(student.CompletedCredits || 0);
  const totalSubjects = parseInt(student.TotalSubjects || 0);
  const avgScore = parseInt(student.AvgScore || 0);

  // ✅ Pie Chart: Credits completed vs remaining
  const creditPieData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [completedCredits, Math.max(0, 120 - completedCredits)],
        backgroundColor: ["#4CAF50", "#ddd"],
      },
    ],
  };

  // ✅ Bar Chart: Subject scores
  const barData = {
    labels: ["Math", "Physics", "CS", "Elective", "Lab"],
    datasets: [
      {
        label: "Scores",
        backgroundColor: "#2196F3",
        data: [
          avgScore - 5,
          avgScore,
          avgScore + 2,
          avgScore - 8,
          avgScore + 5,
        ],
      },
    ],
  };

  return (
    <div className="dashboard">
      {/* ✅ Header */}
      <div className="dashboard-header">
        <img
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.Name || "Student"}`}
          alt="profile"
          className="profile-avatar"
        />
        <div>
          <h2>{student.Name}</h2>
          <p>
            {student.Department} Department | Year {student.Year}
          </p>
          <p>
            Email: {student.Email} | Contact: {student.Contact}
          </p>
        </div>
      </div>

      {/* ✅ Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Completed Credits</h3>
          <p>{completedCredits}</p>
        </div>
        <div className="stat-card">
          <h3>Total Subjects</h3>
          <p>{totalSubjects}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p>{avgScore}%</p>
        </div>
      </div>

      {/* ✅ Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Credits Progress</h3>
          <Pie data={creditPieData} />
        </div>

        <div className="chart-card">
          <h3>Subject Scores</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* ✅ Subjects Table */}
      <div className="subjects-section">
        <h3>Enrolled Subjects</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Credits</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mathematics</td>
              <td>4</td>
              <td>{avgScore - 5}%</td>
            </tr>
            <tr>
              <td>Physics</td>
              <td>3</td>
              <td>{avgScore}%</td>
            </tr>
            <tr>
              <td>Computer Science</td>
              <td>4</td>
              <td>{avgScore + 2}%</td>
            </tr>
            <tr>
              <td>Elective</td>
              <td>2</td>
              <td>{avgScore - 8}%</td>
            </tr>
            <tr>
              <td>Lab</td>
              <td>1</td>
              <td>{avgScore + 5}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
