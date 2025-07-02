import React from "react";
function Studentcard({student, onClick }){
    const { name, id, branch, year, rank, imageUrl}=student;
     const handleCardClick = () => {
        // Call the onClick prop, passing the entire student object back to the parent (App.js)
        if (onClick) { // Ensure onClick prop is provided before calling it
            onClick(student);
        }
    };
    return (
        <div className="student-card" onClick={handleCardClick}>
            {name ?(
                <>
                <div className="student-image-container">
                    <img src= {imageUrl} alt={name} className="student-image"/>
                </div>
                <div className="student-info">
                    <h3 className="student-name">{name}</h3>
                    <p>ID: {id}</p>
                    <p>Branch: {branch}</p>
                    <p>Year: {year}</p>
                    <p>Rank: {rank}</p>
                </div>
                </>
            ):(
                <div className="empty-card"></div>
            )}
        </div>
    );
}
export default Studentcard;