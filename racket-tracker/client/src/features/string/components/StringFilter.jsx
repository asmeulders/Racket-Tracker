import { useState, useEffect } from 'react';

export const StringFilter = ({onFilterChange}) => {
  /**
   * The filter component for a string in the dashboard.
   * Filters:
   *  - Brand Name
   *  - String Name
   *  - Price range
   */
  const [ filters, setFilters ] = useState({
    brandName: '',
    stringName: '',
    priceMin: '',
    priceMax: ''
  })

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'brandName': filters.brandName,
      'stringName': filters.stringName,
      'priceMin': filters.priceMin,
      'priceMax': filters.priceMax
    })
  }, [filters])

  return (
    <div className='filter-content'>
      <label htmlFor="brandFilter">Brand Name:</label>
      <input id="brandFilter" className="filter-text-input" type="text" placeholder='Brand Name' onChange={(e) => setFilters(prev => ({...prev, brandName: e.target.value}))}/>
      
      <label htmlFor="stringFilter">String Name:</label>
      <input id="stringFilter" className='filter-text-input' type="text" placeholder='String Name' onChange={(e) => setFilters(prev => ({...prev, stringName: e.target.value}))}/>
      
      <label htmlFor="priceFilterMin">Price Minimum:</label>
      <input id='priceFilterMin' className='filter-num-input' type="number" placeholder='Price Min' onChange={(e) => setFilters(prev => ({...prev, priceMin: e.target.value}))}/>
      
      <label htmlFor="priceFilterMax">Price Maximum:</label>
      <input id='priceFilterMax' className='filter-num-input' type="number" placeholder='Price Max' onChange={(e) => setFilters(prev => ({...prev, priceMax: e.target.value}))}/>
    </div>
  );
};