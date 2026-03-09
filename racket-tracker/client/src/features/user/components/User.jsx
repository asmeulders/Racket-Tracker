import { format } from 'date-fns';

import '../User.css';

export function User({user}) {
  return (
    <div key={user.id} className='user-container'>
      <strong>{user.username}</strong>
      <div className='owns-container'>
        Owns:
        <ul className='owns-racket'>
          {user.rackets?.map(owns => (
            <li key={owns.racket_id}> {owns.racket_brand} {owns.racket_name} ({owns.quantity})</li>
          ))}
        </ul>
      </div>
      <div className='user-orders-container'>
        Orders:
        <ul className='user-order'>
          {user.orders?.map(o => (
            <li key={o.id}>{format(new Date(o.order_date), 'MM/dd/yyyy')}: {o.racket_brand} {o.racket_name}</li>
          ))}
        </ul>
      </div>
    </div>   
  )
}