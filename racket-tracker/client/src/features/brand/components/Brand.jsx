import '../Brand.css';

export function Brand({brand}) {
  
  return (
      <div className='brand-details'>
        <div className='item-info item-info--large'>{brand.name}</div>
      </div>
  )
}