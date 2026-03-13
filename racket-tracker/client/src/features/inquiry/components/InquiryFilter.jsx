import { useState, useEffect } from 'react';

export const InquiryFilter = ({onFilterChange}) => {
  /**
   * The filter component for an inquiry in the dashboard.
   * Filters:
   *  - User Name
   *  - Inquiry Date
   */
  const [username, setUsername] = useState('')
  const [inqDate, setInqDate] = useState('');

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'username': username,
      'inq_date': inqDate
    })
  }, [username, inqDate])

  return (
    <div className='filter-container'>
      <label htmlFor="usernameFilter">Inquirer Name:</label>
      <input id="usernameFilter" className='filter-text-input' type="text" placeholder='User Name' onChange={(e) => setUsername(e.target.value)}/>
      
      <label htmlFor="orderDateFilter">Inquiry Date:</label>
      <input id="orderDateFilter" className="filter-date-input" type="date" onChange={(e) => setInqDate(e.target.value)}/>
    </div>
  )
}