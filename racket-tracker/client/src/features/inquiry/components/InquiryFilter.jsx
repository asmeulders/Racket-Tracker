import { useState, useEffect } from 'react';

export const InquiryFilter = ({onFilterChange}) => {
  /**
   * The filter component for an inquiry in the dashboard.
   * Filters:
   *  - Name
   *  - Inquiry Date
   */
  const [ filters, setFilters ] = useState({
    name: '',
    inqDate: ''
  })

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'name': filters.name,
      'inqDate': filters.inqDate
    })
  }, [filters])

  return (
    <div className='filter-content'>
      <label htmlFor="nameFilter">Name:</label>
      <input id="nameFilter" className='filter-text-input' type="text" placeholder='Name' onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))}/>
      
      <label htmlFor="orderDateFilter">Date:</label>
      <input id="orderDateFilter" className="filter-date-input" type="date" onChange={(e) => setFilters(prev => ({...prev, inqDate: e.target.value}))}/>
    </div>
  )
}