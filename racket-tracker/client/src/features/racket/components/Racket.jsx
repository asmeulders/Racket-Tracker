import '../Racket.css';


export function Racket({ item }) {
  return (
    <div className='racket-card'>
      <h2>{item.brandName} {item.name}</h2>
      <span>${item.price}</span>
    </div>
  )
}