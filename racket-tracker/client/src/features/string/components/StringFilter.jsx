import { useState, useEffect } from 'react';

export const StringFilter = ({onFilterChange}) => {
  /**
   * The filter component for a string in the dashboard.
   * Filters:
   *  - Brand Name
   *  - String Name
   *  - Price range
   */
  const [brandName, setBrandName] = useState('')
  const [stringName, setStringName] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'brand_name': brandName,
      'string_name': stringName,
      'price_min': priceMin,
      'price_max': priceMax
    })
  }, [brandName, stringName, priceMin, priceMax])

  return (
    <div className='filter-container'>
      <label htmlFor="brandFilter">Brand Name:</label>
      <input id="brandFilter" className="filter-text-input" type="text" placeholder='Brand Name' onChange={(e) => setBrandName(e.target.value)}/>
      
      <label htmlFor="stringFilter">String Name:</label>
      <input id="stringFilter" className='filter-text-input' type="text" placeholder='String Name' onChange={(e) => setStringName(e.target.value)}/>
      
      <label htmlFor="priceFilterMin">Price Minimum:</label>
      <input id='priceFilterMin' className='filter-num-input' type="number" placeholder='Price Min' onChange={(e) => setPriceMin(e.target.value)}/>
      
      <label htmlFor="priceFilterMax">Price Maximum:</label>
      <input id='priceFilterMax' className='filter-num-input' type="number" placeholder='Price Max' onChange={(e) => setPriceMax(e.target.value)}/>
    </div>
  );
};