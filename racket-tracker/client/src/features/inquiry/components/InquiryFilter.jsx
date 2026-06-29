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
    inqDateBefore: '',
    inqDateAfter: '',
  })

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'name': filters.name,
      'inqDateBefore': filters.inqDateBefore,
      'inqDateAfter': filters.inqDateAfter
    })
  }, [filters])

  return (
    <div className='filter-content'>
      <label htmlFor="nameFilter">Name:</label>
      <input id="nameFilter" className='filter-text-input' type="text" placeholder='Name' onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))}/>
      
      <label htmlFor="orderDateFilter">Date Before:</label>
      <input id="orderDateFilter" className="filter-date-input" type="date" value={filters.inqDateBefore} onChange={(e) => setFilters(prev => ({...prev, inqDateBefore: e.target.value}))}/>
      
      <label htmlFor="orderDateFilter">Date After:</label>
      <input id="orderDateFilter" className="filter-date-input" type="date" value={filters.inqDateAfter} onChange={(e) => setFilters(prev => ({...prev, inqDateAfter: e.target.value}))}/>
    </div>
  )
}