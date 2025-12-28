import { useState, useEffect } from 'react'
import axios from 'axios'

export function StringList({strings}) {
    return(
        <div>
          <h2>Strings</h2>
          <ul>
            {strings.map(s => (
              <String key={s.id} string={s}/>
            ))}
          </ul>
        </div>
    )
}

export function String({string}) {
    return (
      <li >{string.name} - ${string.price_per_racket}</li>
    )
}

export function StringForm({ onStringCreated }){
  const [name, setName] = useState('');
  const [pricePerRacket, setPricePerRacket] = useState('');

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-string", {
        "name": name,
        "price_per_racket": pricePerRacket
      })
      
      setName('');
      setPricePerRacket('');

      onStringCreated();
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
      <h2>Create a string</h2>
      {error && <div>{error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>

        <label htmlFor="name">String Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="price">Price per racket:</label>
        <input type="number" id="price" value={pricePerRacket} onChange={(e) => setPricePerRacket(e.target.value)} /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}