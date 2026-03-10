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
      <input type="text" placeholder='Brand Name' onChange={(e) => setBrandName(e.target.value)}/>
      <input type="text" placeholder='String Name' onChange={(e) => setStringName(e.target.value)}/>
      <input type="number" placeholder='Price Min' onChange={(e) => setPriceMin(e.target.value)}/>
      <input type="number" placeholder='Price Max' onChange={(e) => setPriceMax(e.target.value)}/>
    </div>
  );
};