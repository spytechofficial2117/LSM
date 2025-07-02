
import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import FilterPanel from './FilterPanel';

function SearchBar( {onApplyFilters, onResetFilters, currentBranch, currentYear, searchQuery, onSearchChange}) {
  const [isFilterpanelopen, setIsFilterPanelOpen]= useState(false);
  const areFiltersActive = currentBranch !== 'All' || currentYear !== 'All';
  
  const handleCloseFilterPanel= () =>{
    setIsFilterPanelOpen(false);
  };
  return (
    <div className='search-bar-wrapper'>
    <div className="search-bar-container">
      <div className='search-input-group'>
      <input
        type="text"
        placeholder="Search students by name or ID"
        className="search-input"
        value={searchQuery}
        onChange={(e)=> onSearchChange(e.target.value)}
      />
      <button className="search-icon">
         <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      </div>
      <button className="filter-icon" onClick={ ()=> setIsFilterPanelOpen(!isFilterpanelopen)}>
          <FontAwesomeIcon icon={faFilter} />
          {areFiltersActive && <span className="filter-active-dot"></span>}
      </button>
      </div>
      {isFilterpanelopen && (
        <FilterPanel
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
            onClose={handleCloseFilterPanel}
            initialBranch={currentBranch}
            initialYear={currentYear}
            />
      )}
    </div>
  );
}
export default SearchBar;