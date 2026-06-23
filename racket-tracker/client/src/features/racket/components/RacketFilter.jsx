import { useState, useEffect } from 'react';

export const RacketFilter = ({onFilterChange}) => {
  /**
   * The filter component for a racket in the dashboard.
   * Filters:
   *  - Brand Name
   *  - Racket Name
   *  - Price range
   */
  const [ filters, setFilters ] = useState({
    brandName: '',
    racketName: '',
    priceMin: '',
    priceMax: ''
  })

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'brandName': filters.brandName,
      'racketName': filters.racketName,
      'priceMin': filters.priceMin,
      'priceMax': filters.priceMax
    })
  }, [filters])

  return (
    <div className='filter-content'>
      <label htmlFor="brandNameFilter">Brand Name:</label>
      <input id="brandNameFilter" className='filter-text-input' type="text" placeholder='Brand Name' onChange={(e) => setFilters(prev => ({...prev, brandName: e.target.value}))}/>
      
      <label htmlFor="racketNameFilter">Racket Name:</label>
      <input className="filter-text-input" type="text" placeholder='Racket Name' onChange={(e) => setFilters(prev => ({...prev, racketName: e.target.value}))}/>
      
      <label htmlFor="priceFilterMin">Price Minimum:</label>
      <input id="priceFilterMin" className='filter-num-input' type="number" placeholder='Price Min' onChange={(e) => setFilters(prev => ({...prev, priceMin: e.target.value}))}/>
      
      <label htmlFor="priceFilterMax">Price Maximum:</label>
      <input id="priceFilterMax" className='filter-num-input' type="number" placeholder='Price Max' onChange={(e) => setFilters(prev => ({...prev, priceMax: e.target.value}))}/>
    </div>
  );
};