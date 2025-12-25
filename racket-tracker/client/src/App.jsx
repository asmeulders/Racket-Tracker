import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [rackets, setRackets] = useState([])

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
      // Fetch Users from DB 1
      const userRes = await axios.get('http://127.0.0.1:5000/users');
      setUsers(userRes.data);

      // Fetch Rackets from DB 2
      const racketRes = await axios.get('http://127.0.0.1:5000/rackets');
      setRackets(racketRes.data);
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Full Stack Dashboard</h1>
      <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
        Initialize & Seed Databases
      </button>

      <div style={{ display: "flex", gap: "50px" }}>
        
        {/* Section for Database 1 */}
        <div>
          <h2>Users (Database A)</h2>
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.username}</li>
            ))}
          </ul>
        </div>

        {/* Section for Database 2 */}
        <div>
          <h2>Rackets (Database B)</h2>
          <ul>
            {rackets.map(p => (
              <li key={p.id}>{p.name} - ${p.price}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default App