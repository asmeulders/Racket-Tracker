import '../Brand.css';

export function Brand({ item }) {
  
  return (
      <div className='brand-card'>
        <h2>{item.name}</h2>
      </div>
  )
}