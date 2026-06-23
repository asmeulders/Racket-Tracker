import { useState, useEffect } from 'react';

export const BrandFilter = ({onFilterChange}) => {
    const [ filters, setFilters ] = useState({
        brandName: ''
    });

    useEffect(() => {
        onFilterChange({
            'brandName': filters.brandName
        });
    }, [filters]);

    return (
        <div className='filter-content'>
            <label htmlFor="brandFilter">Brand Name:</label>
            <input id="brandFilter" className="filter-text-input" type="text" placeholder='Brand Name' onChange={(e) => setFilters(prev => ({...prev, brandName: e.target.value}))}/>
        </div>
    )
}