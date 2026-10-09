import "../String.css"

export function String({ item }) {
  return (
    <div className='string-card'>
      <h2>{item.brandName} {item.name}</h2>
      <span>${item.pricePerRacket}</span>
    </div>
  )
}