import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

import { RacketList, RacketForm } from './components/racket/racket.jsx'
import { OrderList, OrderForm } from './components/order/order.jsx'
import { StringList } from './components/string/string.jsx'
import { UserList } from './components/user/user.jsx'

function App() {
  const [users, setUsers] = useState([])
  const [rackets, setRackets] = useState([])
  const [orders, setOrders] = useState([])
  const [strings, setStrings] = useState([])

  const initDatabases = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/init_db');
      alert("Databases Created & Seeded!");
      fetchData();
    } catch (error) {
      console.error("Error initializing DB:", error);
    }
  };

  const fetchData = async () => {
    try {
      const userRes = await axios.get('http://127.0.0.1:5000/users');
      setUsers(userRes.data);

      const racketRes = await axios.get('http://127.0.0.1:5000/rackets');
      setRackets(racketRes.data);

      const stringRes = await axios.get('http://127.0.0.1:5000/strings');
      setStrings(stringRes.data);

      const orderRes = await axios.get('http://127.0.0.1:5000/orders');
      setOrders(orderRes.data);
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  const fetchRackets = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/rackets');
      setRackets(response.data);
    } catch (error) {
      console.error("Error fetching rackets:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching rackets:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Racket 🎾 Tracker</h1>
      <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
        Initialize & Seed Databases
      </button>

      <div style={{ display: "flex", gap: "50px" }}>
        
        <UserList users={users} />

        <RacketList rackets={rackets}/>

        <OrderList orders={orders} />

        <StringList strings={strings} />

      </div>

      <div>
        <RacketForm onRacketCreated={fetchRackets}/>

        <OrderForm onOrderCreated={fetchOrders}/>
      </div>
    </div>
  )
}

export default App