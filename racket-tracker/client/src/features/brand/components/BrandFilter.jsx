export const BrandFilter = ({onFilterChange}) => {

  return (
    <div className='filter-container'>
          <input type="text" placeholder='Brand Name' onChange={(e) => onFilterChange({'brand_name': e.target.value})}/>
    </div>
  )
}