import { useEffect, useState } from 'react';
import axios from 'axios'
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { RacketSelect } from '../racket/Racket'
import { StringSelect } from '../string/String'
import { UserSelect } from '../user/User';

import './Order.css';

export function Order({order}) {
  const [complete, setComplete] = useState(order.complete);
  const [paid, setPaid] = useState(order.paid);

  const displayDate = order.due ? format(new Date(order.due), 'MM/dd/yyyy') : null;

  // const navigate = useNavigate();
  
  const completeOrder = async (order) => {
    try{
      const response = await axios.patch(`http://localhost:5000/complete-order/${order.id}`)
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
      const response = await axios.patch(`http://localhost:5000/pay-for-order/${order.id}`)
      setPaid(response.data.order.paid)
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else{
        console.log("Could not connect to server.");
      }
    }
  }

  // const handleDelete = async () => {
  //   console.log(order);
  //   const confirmed = window.confirm("Are you sure you want to delete this item?");

  //   if (confirmed) {
  //     try {
  //       await axios.delete(`http://localhost:5000/delete-order/${order.id}`);
  //       onDelete();
  //     } catch (error) {
  //       console.error("Error deleting order:", error);
  //     }
  //     console.log("Item deleted!");
  //   } else {
  //     console.log("Action cancelled.");
  //   }
  // };

  useEffect(() => {
    setComplete(order.complete);
    setPaid(order.paid);
  }, [order]);

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
        <input type="checkbox" id="sameForCrosses" onChange={(e) => setSameForCrosses(e.target.checked)} checked={sameForCrosses}/><br />
        
        {!sameForCrosses && 
          <div>
            <StringSelect onStringChange={setCrossesId} value={crossesId} strings={strings} />
            
            <label htmlFor="crossesTension">crossesTension:</label>
            <input type="number" id="crossesTension" value={crossesTension} onChange={(e) => setCrossesTension(e.target.value)} /><br />
          </div>
        }

        <label htmlFor="paid">Paid</label>
        <input type="checkbox" id='paid' onChange={(e) => setPaid(e.target.value)} checked={paid}/>

        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}

export const OrderFilter = ({onFilterChange}) => {
  /**
   * The filter component for an order in the dashboard.
   * Filters:
   *  - User Name
   *  - Order Date
   *  - Due Date
   *  - Completion
   *  - Paid Status
   *  - Racket Brand
   *  - Racket Name
   *  - String Brand
   *  - String Name
   */
  const [username, setUsername] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState('');
  const [paid, setPaid] = useState('');
  const [racketBrand, setRacketBrand] = useState('')
  const [racketName, setRacketName] = useState('');
  const [stringBrand, setStringBrand] = useState('')
  const [stringName, setStringName] = useState('');

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'username': username,
      'order_date': orderDate,
      'due_date': dueDate,
      'completed': completed,
      'paid': paid,
      'racket_brand': racketBrand,
      'racket_name': racketName,
      'string_brand': stringBrand,
      'string_name': stringName
    })
  }, [username, orderDate, dueDate, completed, paid, racketBrand, racketName, stringBrand, stringName])

  return (
    <div className='filter-container'>
      {/* User Name */}
      <input type="text" placeholder='User Name' onChange={(e) => setUsername(e.target.value)}/>
      {/* Order Date */}
      <label htmlFor="orderDate">Order Date</label>
      <input type="date" id='orderDate' onChange={(e) => setOrderDate(e.target.value)}/>
      {/* Order Due Date */}
      <label htmlFor="orderDate">Order Due</label>
      <input type="date" id='dueDate' onChange={(e) => setDueDate(e.target.value)}/>
      {/* Racket */}
      <div className='brand-item-container'>
        <input type="text" placeholder='Racket Brand' onChange={(e) => setRacketBrand(e.target.value)}/>
        <input type="text" placeholder='Racket Name' onChange={(e) => setRacketName(e.target.value)}/>
      </div>
      {/* String */}
      <div className='brand-item-container'>
        <input type="text" placeholder='String Brand' onChange={(e) => setStringBrand(e.target.value)}/>
        <input type="text" placeholder='String Name' onChange={(e) => setStringName(e.target.value)}/>
      </div>
      {/* Paid */}
      <select onChange={(e) => setPaid(e.target.value)} value={paid}>
        <option value="">Show All</option>
        <option value="unpaid">Show Only Unpaid</option>
        <option value="paid">Show Only Paid</option>
      </select>
      {/* Completed */}
      <select onChange={(e) => setCompleted(e.target.value)} value={completed}>
        <option value="">Show all</option>
        <option value="uncompleted">Show Only Uncompleted</option>
        <option value="completed">Show Only Completed</option>
      </select>
    </div>
  )
}