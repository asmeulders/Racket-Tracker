import '../Racket.css';


export function Racket({racket}) {
  return (
    <div className='racket-card'>
      <h2>{racket.brandName} {racket.name}</h2>
      <span>${racket.price}</span>
    </div>
  )
}