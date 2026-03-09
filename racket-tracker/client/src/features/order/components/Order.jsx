import { useState } from 'react';
import { format } from 'date-fns';

import { useOrder } from '../useOrder';
import '../Order.css';

export function Order({order}) {
  const { completeOrder, orderPaid } = useOrder();
  const [complete, setComplete] = useState(order.complete);
  const [paid, setPaid] = useState(order.paid);

  const displayDate = order.due ? format(new Date(order.due), 'MM/dd/yyyy') : null;

  const handleComplete  = async () => {
    const response = await completeOrder(order);
    if (response !== undefined) {
      setComplete(response);
    }
  }

  const handlePay = async () => {
    const response = await orderPaid(order);
    if (response !== undefined) {
      setPaid(response);
    }
  }

  return (
    <div className='order-container'>
      <div className='order-header'>
        <p className='order-title'>{order.user_name}'s {order.racket_brand} {order.racket_name}</p> 
        <p className='order-complete-status'>{!complete ? `Due: ${displayDate ? displayDate : 'Unknown'}` : "Order complete"}</p>
      </div>
      <ul className='job-details-container'>
        {order.job_details?.map((job, index) => (
          <li key={index} className='job-details'>
            {job.direction ? `${job.direction === 'mains' ? 'Mains' : 'Crosses'}: ` : ''}
            {job.string_brand} {job.string_name} at {job.tension}lbs 
          </li>
        ))}
      </ul>
      <div className='paid-complete-container'>
        <button className={`paid-btn ${paid && 'paid-btn--paid'}`} onClick={() => handlePay(order)}>{paid ? 'Paid' : 'Unpaid'}</button>
        {!complete && <button className='complete-btn' onClick={() => handleComplete(order)}>Complete Order</button>}
      </div>
    </div>
  )
}