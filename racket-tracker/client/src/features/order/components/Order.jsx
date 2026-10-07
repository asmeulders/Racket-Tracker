import { useEffect } from 'react';
import { format, getDate } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useOrder } from '../useOrder';
import '../Order.css';

export function Order({order}) {
  const { completeOrder, orderPaid } = useOrder();

  const complete = order?.complete ? order?.complete : null;
  const dueDate = order?.due ? new Date(order.due) : null;
  const dateStr = dueDate 
    ? dueDate.toLocaleDateString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}) 
    : null;

  const timeStr = dueDate
    ? dueDate.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
    : null;
  const late = dueDate && dueDate < new Date();

  // Depending on screen width could show more info
  return (
    <div className='order-card'>
      <h2 className='order-name'>{order?.user?.firstName} {order?.user?.lastName}</h2>

      <span className='order-racket'>{order.racketBrand} {order.racketName}</span>

      <span className='order-price'>${order.totalCost} {order.paid ? 'Paid' : "Unpaid"}</span>

      <div className='order-date'>
        <span>{dateStr ? dateStr : 'XX/XX/XXXX'}</span><br />
        <span>{timeStr ? timeStr : '12:00 AM'}</span>
      </div>
      
      <span className='order-icon'>
        {
          complete
          ? <i class="fa-regular fa-circle-check"></i>
          : (
            late
            ? <i class="fa-regular fa-alarm-clock"></i>
            : <i class="fa-solid fa-table-tennis-paddle-ball"></i>
          )
        }   
      </span>
    </div>
  )
}