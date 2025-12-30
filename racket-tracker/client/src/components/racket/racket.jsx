import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrandSelect } from '../brand/Brand'

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
    return (
            <li>{racket.brand_name} {racket.name} - ${racket.price}</li>
    )
}

export function RacketForm({ onRacketCreated, brands }){
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand_id, setBrand_id] = useState('');

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-racket", {
        "name": name,
        "price": price,
        "brand_id": brand_id
      })
      
      setName('');
      setPrice('');
      setBrand_id('');

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
      <h2>Create a racket</h2>
      {error && <div>{error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>
        <BrandSelect value={brand_id} brands={brands} onBrandChange={setBrand_id} />

        <label htmlFor="name">Racket Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}

export function RacketSelect({ onRacketChange, value, rackets }) {
  const handleSelect = (event) => {
    const racket_id = event.target.value;

    onRacketChange(racket_id);
  }
  
  return (
    <div>
      <label htmlFor='racket'>Racket:</label>
      <select name="rackets" id="racket" value={value} required onChange={handleSelect}>
        <option value="">--Please choose a racket--</option>
        {rackets.map(racket => (
          <option key={racket.id} value={racket.id}>{racket.brand_name} {racket.name}</option>
        ))}
      </select>
    </div>
    
  )
}