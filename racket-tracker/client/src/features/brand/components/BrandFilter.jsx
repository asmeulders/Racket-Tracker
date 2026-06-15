export const BrandFilter = ({onFilterChange}) => {
    return (
        <div className='filter-container'>
            <label htmlFor="brandFilter">Brand Name:</label>
            <input id="brandFilter" className="filter-text-input" type="text" placeholder='Brand Name' onChange={(e) => onFilterChange({'brandName': e.target.value})}/>
        </div>
    )
}