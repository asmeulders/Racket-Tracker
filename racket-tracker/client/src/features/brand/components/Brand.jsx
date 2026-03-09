import '../Brand.css';

export function Brand({brand}) {
  
  return (
      <div className='brand-container'>
        {brand.name}
      </div>
  )
}