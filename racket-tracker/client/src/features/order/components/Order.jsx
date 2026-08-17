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
    ? dueDate.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) 
    : null;

  const timeStr = dueDate
    ? dueDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
    : null;
  const late = dueDate && dueDate < new Date();

  // Depending on screen width could show more info
  return (
    <div className='order-container'>
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
      
      
      <div>
        <h3 className='order-name'>{order?.user?.firstName} {order?.user?.lastName}</h3>
        <p className={`order-date ${late ? 'order-date--late' : null}`}>Due: {dateStr ? dateStr : 'XX/XX/XXXX'} {timeStr ? timeStr : '12:00 AM'}</p>
      </div>
      <div>
        <h4 className='order-price' >${order.totalCost}</h4>
        <p>{order.paid ? 'Paid' : "Unpaid"}</p>
      </div>
      
    </div>
  )
}