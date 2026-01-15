import { useEffect, useState } from 'react';
import axios from 'axios'
import { format, parseISO, formatDistanceToNow } from 'date-fns';

import { RacketSelect } from '../racket/Racket'
import { StringSelect } from '../string/String'
import { UserSelect } from '../user/User';

import './Order.css';

export function Order({order, onDelete}) {
  const [complete, setComplete] = useState(order.complete);
  const [paid, setPaid] = useState(order.paid);

  const displayDate = order.due ? format(new Date(order.due), 'MM/dd/yyyy') : null;

  const completeOrder = async (order) => {
    try{
      const response = await axios.patch('http://localhost:5000/complete-order',
        { "order_id": order.id }
      )
      setComplete(response.data.order.complete)
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else{
        console.log("Could not connect to server.");
      }
    }
  }

  const orderPaid = async (order) => {
    try{
      const response = await axios.patch('http://localhost:5000/pay-for-order',
        { 
          "order_id": order.id,
          "paid": paid
        }
      )
      setPaid(response.data.order.paid)
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else{
        console.log("Could not connect to server.");
      }
    }
  }

  return (
    <div className='order-container'>
      <div className='order-header'>
        <p className='order-title'>{order.user_name}'s {order.racket_brand} {order.racket_name}</p> 
        <p className='order-complete-status'>{!complete ? `Due: ${displayDate ? displayDate : 'Unknown'}` : "Order complete"}</p>
      </div>
      <button 
        className="delete-btn"
        onClick={(order) => onDelete(order)}
        aria-label="Delete item"
      >
        X
      </button>
      <ul className='job-details-container'>
        {order.job_details?.map((job, index) => (
          <li key={index} className='job-details'>
            {job.direction ? `${job.direction === 'mains' ? 'Mains' : 'Crosses'}: ` : ''}
            {job.string_brand} {job.string_name} at {job.tension}lbs 
          </li>
        ))}
      </ul>
      <div className='paid-complete-container'>
        <button className={`paid-btn ${paid && 'paid-btn--paid'}`} onClick={() => orderPaid(order)}>{paid ? 'Paid' : 'Unpaid'}</button>
        {!complete && <button className='complete-btn' onClick={() => completeOrder(order)}>Complete Order</button>}
      </div>
    </div>
  )
}

// export const OrderList = ({orders, onOrderDeleted}) => {
//   const [newOrders, setNewOrders] = useState(orders);

//   const deleteOrder = async (order) => {
//     try {
//       await axios.delete(`http://localhost:5000/delete-order/${order.id}`)

//       onOrderDeleted()
//     } catch (error) {
//       console.log("Error:", error)
//     }
//   }

//   useEffect(() => {
//     setNewOrders(orders)
//   }, [orders])

//     return(
//         <div>
//           <ul>
//             {newOrders.map(o => (
//               <div key={o.id} >
//                 <Order order={o} onOrderDeleted={() => onOrderDeleted()}/>
//                 <button onClick={() => {deleteOrder(o)}}>X</button>
//               </div>
//             ))}
//           </ul>
//         </div>
//     )
// }

export const OrderForm = ({ onOrderCreated, rackets, strings, users }) => {
  const [racketId, setRacketId] = useState("");
  const [userId, setUserId] = useState('');
  const [stringId, setStringId] = useState("");
  const [tension, setTension] = useState('');
  const [sameForCrosses, setSameForCrosses] = useState(true);
  const [crossesId, setCrossesId] = useState("");
  const [crossesTension, setCrossesTension] = useState('');
  const [paid, setPaid] = useState(false)

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-order", {
        "racket_id": racketId,
        "user_id": userId,
        "string_id": stringId,
        "tension": tension,
        "crosses_id": !sameForCrosses ? crossesId : null,
        "crosses_tension": !sameForCrosses ? crossesTension : null,
        "same_for_crosses": sameForCrosses,
        "paid": paid
      })

      setRacketId("");
      setUserId('');
      setStringId("");
      setTension('');
      setCrossesId("");
      setCrossesTension('');
      setSameForCrosses(true);
      setPaid(false);

      onOrderCreated();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else{
        setError("Could not connect to server.");
      }
    }
  }

  return(
    <div>
      <h2>Create an order</h2>
      {error && <div>{error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>
        <UserSelect onUserChange={setUserId} value={userId} users={users} />

        <RacketSelect onRacketChange={setRacketId} value={racketId} rackets={rackets}/>
        
        <StringSelect onStringChange={setStringId} value={stringId} strings={strings} />
        
        <label htmlFor="tension">Tension:</label>
        <input type="number" id="tension" value={tension} onChange={(e) => setTension(e.target.value)} /><br />

        <label htmlFor="sameForCrosses">{sameForCrosses ? 'Same for crosses' : 'Different for crosses'}</label>
        <input type="checkbox" id="sameForCrosses" onChange={() => setSameForCrosses(!sameForCrosses)} checked={sameForCrosses}/><br />
        
        {!sameForCrosses && 
          <div>
            <StringSelect onStringChange={setCrossesId} value={crossesId} strings={strings} />
            
            <label htmlFor="crossesTension">crossesTension:</label>
            <input type="number" id="crossesTension" value={crossesTension} onChange={(e) => setCrossesTension(e.target.value)} /><br />
          </div>
        }

        <label htmlFor="paid">Paid</label>
        <input type="checkbox" id='paid' onChange={() => setPaid(!paid)} checked={paid}/>

        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}
