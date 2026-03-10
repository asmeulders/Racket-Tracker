import '../Racket.css';


export function Racket({racket}) {
  return (
    <div className='racket-container'>
      {racket.brand_name} {racket.name} - ${racket.price}
    </div>
  )
}