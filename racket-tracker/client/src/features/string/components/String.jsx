import "../String.css"

export function String({string}) {
  return (
    <div className='string-container'>
      {string.brandName} {string.name} - ${string.pricePerRacket} 
    </div>
  )
}