import React from "react";
function Studentcard({student}){
    const { name, id, branch, year, rank, imageUrl}=student;
    return (
        <div className="student-card">
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