import "../String.css"

export function String({string}) {
  return (
    <div className='string-details'>
      <div className="item-info item-info--large">{string.brandName} {string.name}</div>
      <div className="item-info">${string.pricePerRacket} </div>
    </div>
  )
}