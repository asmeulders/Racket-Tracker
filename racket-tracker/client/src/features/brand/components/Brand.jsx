import '../Brand.css';

export function Brand({brand}) {
  
  return (
      <div className='brand-card'>
        <h2>{brand.name}</h2>
      </div>
  )
}