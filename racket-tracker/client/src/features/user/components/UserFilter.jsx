import { useState, useEffect } from "react";

export const UserFilter = ({onFilterChange}) => {
  /**
   * The filter component for a user in the dashboard.
   * Filters:
   *  - User Name
   */

  const [ filters, setFilters ] = useState({
    name: ''
  });

  useEffect(() => {
    onFilterChange({
      name: filters.name
    });
  }, [filters]);

  return (
    <div className='filter-content'>
      <label htmlFor="usernameFilter">Username/First Name/Last Name:</label>
      <input id='usernameFilter' className='filter-text-input' type="text" placeholder='User Name' onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))}/>
    </div>
  )
}