import '../Racket.css';


export function Racket({racket}) {
  return (
    <div className='racket-details'>
      <div className='item-info item-info--large'>{racket.brandName} {racket.name}</div>
      <div className='item-info'>${racket.price}</div>
    </div>
  )
}