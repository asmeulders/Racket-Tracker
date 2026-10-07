import "../String.css"

export function String({string}) {
  return (
    <div className='string-card'>
      <h2>{string.brandName} {string.name}</h2>
      <span>${string.pricePerRacket}</span>
    </div>
  )
}