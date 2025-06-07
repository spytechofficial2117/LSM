
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
function SearchBar( ) {
  return (
    <div className='search-bar-wrapper'>
    <div className="search-bar-container">
      <div className='search-input-group'>
      <input
        type="text"
        placeholder="Search students by name or ID"
        className="search-input"
      />
      <button className="search-icon">
         <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      </div>
      <button className="filter-icon" >
          <FontAwesomeIcon icon={faFilter} />
      </button>
      </div>
    </div>
  );
}
export default SearchBar;
