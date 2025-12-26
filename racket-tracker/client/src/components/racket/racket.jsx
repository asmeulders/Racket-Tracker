import { useState, useEffect } from 'react'
import axios from 'axios'

export function RacketList({rackets}) {
    return(
        <div>
          <h2>Rackets</h2>
          <ul>
            {rackets.map(r => (
              <Racket key={r.id} racket={r}/>
            ))}
          </ul>
        </div>
    )
}

export function Racket({racket}) {
    // const [racket, setRacket] = useState([])

    // const fetchData = async () => {
    //     try {
    //     const racketRes = await axios.get(`http://127.0.0.1:5000/get-racket-by-id/${racket.id}`);
    //     setRacket(racketRes.data);
    //     } catch (error) {
    //     console.error("Error connecting to server:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    return (
            <li>{racket.name} - ${racket.price}</li>
    )
}

export function RacketForm({ onRacketCreated }){
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-racket", {
        "name": name,
        "price": price
      })
      
      setName('');
      setPrice('');

      onRacketCreated();
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
      {error && <div>{error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>

        <label htmlFor="name">Racket Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}