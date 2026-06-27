import { format } from 'date-fns';

import '../User.css';

export function User({user}) {
  return (
    <div key={user.id} className='user-details'>
      <div className='item-info item-info--large'>{user.firstName} {user.lastName} | {user.username}</div>
      {/* this stuff should go to the user page */}
      {/* <div className='item-info'>
        Owns:
        <ul className='owns-racket'>
          {user.rackets?.map(owns => (
            <li key={owns.racketId}> {owns.racketBrand} {owns.racketName} ({owns.quantity})</li>
          ))}
        </ul>
      </div>
      <div className='item-info'>
        Orders:
        <ul className='user-order'>
          {user.orders?.map(o => (
            <li key={o.id}>{format(new Date(o.orderDate), 'MM/dd/yyyy')}: {o.racketBrand} {o.racketName}</li>
          ))}
        </ul>
      </div> */}
    </div>   
  )
}