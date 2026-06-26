import { useState } from 'react';
import { format } from 'date-fns';

import { useOrder } from '../useOrder';
import '../Order.css';

export function Order({order}) {
  const { completeOrder, orderPaid } = useOrder();

  // if (!order) return <p>Order not found</p>;

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

  const getStatusText = () => {
    const now = new Date();
    const due = new Date(order.due);
    if (order.complete) {
      return 'Done';
    } else if (now < due) {
      return 'To Do';
    } else {
      return 'Late';
    }
  }

  return (
    <div className='order-container'>
      <div className='order-info' >{order?.user?.firstName} {order?.user?.lastName}</div>
      <div className={getStatusClassName()} >{getStatusText()}</div>
      <div className='order-info' >{displayDate}</div>
      <div className='order-info' >Racket: {order.racketBrand} {order.racketName}</div>
      <div className='order-info' >Strings: {order.sameForCrosses ? 
        order?.jobDetails?.[0]?.stringBrand + ' ' + order?.jobDetails?.[0]?.stringName + ' @' + order?.jobDetails?.[0]?.tension + 'lbs'
        :
        '(M) ' + order?.jobDetails?.[0]?.stringBrand + ' ' + order?.jobDetails?.[0]?.stringName + ' @' + order?.jobDetails?.[0]?.tension + 'lbs ' +
        '(C) ' + order?.jobDetails?.[0]?.stringBrand + ' ' + order?.jobDetails?.[0]?.stringName + ' @' + order?.jobDetails?.[1]?.tension + 'lbs'
      }</div>
      <div className='order-info' >${order.price} - {order.paid ? 'Paid' : "Unpaid"}</div>
    </div>
  )
}