import React from "react";
import './StudentCard.css';

function Studentcard({ student, onClick }) {
    const { name, id, branch, year, rank, imageUrl } = student;
    const handleCardClick = () => {
        if (onClick) {
            onClick(student);
        }
    };
    return (
        <div className="student-card" onClick={handleCardClick}>
            {name ? (
                <>
                    <div className="student-image-container">
                        <img src={imageUrl || `https://placehold.co/100x100/A8F374/333?text=${name.substring(0,2)}`} alt={name} className="student-image" />
                    </div>
                    <div className="student-info">
                        <h3 className="student-name">{name}</h3>
                        <p>ID: {id}</p>
                        <p>Branch: {branch}</p>
                        <p>Year: {year}</p>
                        <p>Rank: {rank || 'N/A'}</p>
                    </div>
                </>
            ) : (
                <div className="empty-card"></div>
            )}
        </div>
    );
}
export default Studentcard;