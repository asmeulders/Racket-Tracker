import '../Racket.css';


export function Racket({racket}) {
  return (
    <div className='racket-container'>
      {racket.brandName} {racket.name} - ${racket.price}
    </div>
  )
}