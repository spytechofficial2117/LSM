import React, {useState, useEffect} from "react";
function FilterPanel( {onApplyFilters, onResetFilters, onClose, initialBranch, initialYear}){
    const [branch, setBranch]=useState(initialBranch);  
    const [year, setYear]= useState(initialYear);

useEffect(() => {
    setBranch(initialBranch);
    setYear(initialYear);
  }, [initialBranch, initialYear]);


const handleApply = () => {
    onApplyFilters(branch, year); // Apply filters first
    onClose(); // Then close the panel
  };

const handleReset = () => {
    // Reset internal state of the dropdowns to "All"
    setBranch('All');
    setYear('All');
    // Call the parent's reset handler to update the global filter state
    onResetFilters();
    onClose(); // Then close the panel
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
      </div>

      <div className="filter-group">
        <label htmlFor="branch-select" className="filter-label">
          Branch
        </label>
        <select
          id="branch-select"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="filter-select"
        >
          <option value="All">Select Branch</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="CSE">CSE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="year-select" className="filter-label">
          Year
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="filter-select"
        >
          <option value="All">Select year</option>
          <option value="1st year">1st year</option>
          <option value="2nd year">2nd year</option>
          <option value="3rd year">3rd year</option>
          <option value="4th year">4th year</option>
        </select>
      </div>

      <div className="filter-actions">
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
        <button onClick={handleApply} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;