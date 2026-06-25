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
      <div>{order?.user.firstName} {order?.user.lastName}</div>
      <div>{order.complete ? "Done" : "To Do"}</div>
      <div>{displayDate}</div>
      <div>Racket: {order.racketBrand} {order.racketName}</div>
      <div>Strings: {order.sameForCrosses ? 
        order.jobDetails[0].stringBrand + ' ' + order.jobDetails[0].stringName + ' @' + order.jobDetails[0].tension + 'lbs  '
        :
        '(M) ' + order.jobDetails[0].stringBrand + ' ' + order.jobDetails[0].stringName + ' @' + order.jobDetails[0].tension + 'lbs ' +
        '(C) ' + order.jobDetails[0].stringBrand + ' ' + order.jobDetails[0].stringName + ' @' + order.jobDetails[1].tension + 'lbs'
      }</div>
      <div>${order.price} - {order.paid ? 'Paid' : "Unpaid"}</div>
    </div>
  )
}