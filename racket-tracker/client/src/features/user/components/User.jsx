import { format } from 'date-fns';

import '../User.css';

export function User({user}) {
  return (
    <div key={user.id} className='user-container'>
      <strong>{user.firstName} {user.lastName} </strong><span>({user.username})</span>
      <div className='owns-container'>
        Owns:
        <ul className='owns-racket'>
          {user.rackets?.map(owns => (
            <li key={owns.racketId}> {owns.racketBrand} {owns.racketName} ({owns.quantity})</li>
          ))}
        </ul>
      </div>
      <div className='user-orders-container'>
        Orders:
        <ul className='user-order'>
          {user.orders?.map(o => (
            <li key={o.id}>{format(new Date(o.orderDate), 'MM/dd/yyyy')}: {o.racketBrand} {o.racketName}</li>
          ))}
        </ul>
      </div>
    </div>   
  )
}