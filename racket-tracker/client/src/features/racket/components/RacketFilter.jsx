import { useState, useEffect } from 'react';

export const RacketFilter = ({onFilterChange}) => {
  /**
   * The filter component for a racket in the dashboard.
   * Filters:
   *  - Brand Name
   *  - Racket Name
   *  - Price range
   */
  const [brandName, setBrandName] = useState('')
  const [racketName, setRacketName] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'brand_name': brandName,
      'racket_name': racketName,
      'price_min': priceMin,
      'price_max': priceMax
    })
  }, [brandName, racketName, priceMin, priceMax])

  return (
    <div className='filter-container'>
      <label htmlFor="brandNameFilter">Brand Name:</label>
      <input id="brandNameFilter" className='filter-text-input' type="text" placeholder='Brand Name' onChange={(e) => setBrandName(e.target.value)}/>
      
      <label htmlFor="racketNameFilter">Racket Name:</label>
      <input className="filter-text-input" type="text" placeholder='Racket Name' onChange={(e) => setRacketName(e.target.value)}/>
      
      <label htmlFor="priceFilterMin">Price Minimum:</label>
      <input id="priceFilterMin" className='filter-num-input' type="number" placeholder='Price Min' onChange={(e) => setPriceMin(e.target.value)}/>
      
      <label htmlFor="priceFilterMax">Price Maximum:</label>
      <input id="priceFilterMax" className='filter-num-input' type="number" placeholder='Price Max' onChange={(e) => setPriceMax(e.target.value)}/>
    </div>
  );
};