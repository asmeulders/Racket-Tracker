import "../String.css"

export function String({string}) {
  return (
    <div className='string-container'>
      {string.brand_name} {string.name} - ${string.price_per_racket} 
    </div>
  )
}