import { useState } from 'react';
import { format } from 'date-fns';

import { useOrder } from '../useOrder';
import '../Order.css';

export function Order({order}) {
  const { completeOrder, orderPaid } = useOrder();

  const displayOrderDate = order.orderDate ? format(new Date(order.orderDate), 'MM/dd/yyyy') : null;
  const dueDate = order.due && new Date(order.due);
  const dateStr = dueDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const timeStr = dueDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const getStatusClassName = () => {
    const className = 'order-status ';
    const now = new Date();
    const due = new Date(order.due);
    if (order.complete) {
      return className + 'order-status--done';
    } else if (now < due) {
      return className + 'order-status--to-do';
    } else {
      return className + 'order-status--late';
    }
  }

  // Depending on screen width could show more info
  return (
    <div className='order-container'>
      <h3 className='order-name'>{order?.user?.firstName} {order?.user?.lastName}</h3>
      <p className='order-due-date'>Due: {dateStr} {timeStr}</p>
      <p className='order-price' >${order.totalCost} - {order.paid ? 'Paid' : "Unpaid"}</p>
    </div>
  )
}