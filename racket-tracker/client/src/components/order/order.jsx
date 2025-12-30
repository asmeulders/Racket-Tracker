import { useState } from 'react';
import axios from 'axios'
import { RacketSelect } from '../racket/racket'
import { StringSelect } from '../string/string'

export function OrderList({orders}) {
    return(
        <div>
          <h2>Orders</h2>
          <ul>
            {orders.map(o => (
              <Order key={o.id} order={o}/>
            ))}
          </ul>
        </div>
    )
}

export function Order({order}) {
  const [complete, setComplete] = useState(order.complete);

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
  return (
    <li style={{marginBottom: "10px", borderBottom: "1px solid #ccc"}}>
      <strong>{!complete ? `Due on ${order.due}` : "Order complete"}</strong> - {order.racket_name} ${order.price}
      <ul style={{fontSize: "0.9em", color: "#ffffffff"}}>
        {order.job_details && order.job_details.map((job, index) => (
          <li key={index}>
            {job.string_brand} {job.string_name} @ {job.tension}lbs 
            {job.direction ? ` (${job.direction})` : ''}
          </li>
        ))}
      </ul>
      {!complete && <button onClick={() => completeOrder(order)}>Complete Order</button>}
    </li>
  )
}

export function OrderForm({ onOrderCreated, rackets, strings }){
  // const [date, setdate] = useState('');
  // const [due, setdue] = useState('');
  // const [price, setPrice] = useState('');
  const [racket_id, setRacket_id] = useState('');
  const [user_id, setUser_id] = useState('');
  const [string_id, setString_id] = useState('');
  const [tension, setTension] = useState('');
  const [sameForCrosses, setSameForCrosses] = useState(true);
  const [crosses_id, setCrosses_id] = useState('');
  const [crossesTension, setCrossesTension] = useState('');

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-order", {
        "racket_id": racket_id,
        "user_id": user_id,
        "string_id": string_id,
        "tension": tension,
        "crosses_id": !sameForCrosses ? crosses_id : null,
        "crossesTension": !sameForCrosses ? crossesTension : null
      })

      setRacket_id('');
      setUser_id('');
      setString_id('');
      setTension('');
      setCrosses_id('');
      setCrossesTension('');
      setSameForCrosses(true)

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

        
        <label htmlFor="user_id">User_id:</label>
        <input type="number" id="user_id" value={user_id} onChange={(e) => setUser_id(e.target.value)} /><br />

        <RacketSelect onRacketChange={setRacket_id} value={racket_id} rackets={rackets}/>
        {/* <label htmlFor="racket_id">Racket_id:</label>
        <input type="number" id="racket_id" value={racket_id} onChange={(e) => setRacket_id(e.target.value)} /><br /> */}

        <StringSelect onStringChange={setString_id} value={string_id} strings={strings} />
        {/* <label htmlFor="string_id">String_id:</label>
        <input type="number" id="string_id" value={string_id} onChange={(e) => setString_id(e.target.value)} /><br /> */}

        <label htmlFor="tension">Tension:</label>
        <input type="number" id="tension" value={tension} onChange={(e) => setTension(e.target.value)} /><br />

        <label htmlFor="sameForCrosses">{sameForCrosses ? 'Same for crosses' : 'Different for crosses'}</label>
        <input type="checkbox" id="sameForCrosses" onChange={() => setSameForCrosses(!sameForCrosses)} checked={sameForCrosses}/><br />
        
        {!sameForCrosses && 
          <div>
            <StringSelect onStringChange={setCrosses_id} value={crosses_id} strings={strings} />
            {/* <label htmlFor="crosses_id">Crosses_id:</label>
            <input type="number" id="crosses_id" value={crosses_id} onChange={(e) => setCrosses_id(e.target.value)} /><br /> */}

            <label htmlFor="crossesTension">crossesTension:</label>
            <input type="number" id="crossesTension" value={crossesTension} onChange={(e) => setCrossesTension(e.target.value)} /><br />
          </div>
        }
        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}

// function StringInput() {

// }