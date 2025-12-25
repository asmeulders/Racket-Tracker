import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [rackets, setRackets] = useState([])
  const [orders, setOrders] = useState([])
  const [strings, setStrings] = useState([])

  // Helper to initialize DBs (just for this demo)
  const initDatabases = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/init_db');
      alert("Databases Created & Seeded!");
      fetchData(); // Refresh data
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Racket Tracker</h1>
      <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
        Initialize & Seed Databases
      </button>

      <div style={{ display: "flex", gap: "50px" }}>
        
        <div>
          <h2>Users</h2>
          <ul>
            {users.map(u => (
              <li key={u.id}>
                <strong>{u.username}</strong>
                <ul>
                  {u.rackets.map(r => (
                    <li key={r.id}>Owns: {r.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Rackets</h2>
          <ul>
            {rackets.map(r => (
              <li key={r.id}>{r.name} - ${r.price}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Orders</h2>
          <ul>
            {orders.map(o => (
              <li key={o.id} style={{marginBottom: "10px", borderBottom: "1px solid #ccc"}}>
                <strong>{o.ordered_on}</strong> - {o.racket_name}
                <ul style={{fontSize: "0.9em", color: "#555"}}>
                  {o.job_details && o.job_details.map((job, index) => (
                    <li key={index}>
                      {job.string_name} @ {job.tension}lbs 
                      {job.direction ? ` (${job.direction})` : ''}
                    </li>
                  ))}
                </ul>
                
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Strings</h2>
          <ul>
            {strings.map(s => (
              <li key={s.id}>{s.name} - ${s.price_per_racket}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default App