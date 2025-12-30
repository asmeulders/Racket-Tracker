import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrandSelect } from '../brand/Brand'

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
      <li >{string.brand_name} {string.name} - ${string.price_per_racket}</li>
    )
}

export function StringForm({ onStringCreated, brands }){
  const [name, setName] = useState('');
  const [brand_id, setBrand_id] = useState('');
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
        "price_per_racket": pricePerRacket,
        "brand_id": brand_id
      })
      
      setName('');
      setPricePerRacket('');
      setBrand_id('');

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
        <BrandSelect value={brand_id} brands={brands} onBrandChange={setBrand_id} />

        <label htmlFor="name">String Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="price">Price per racket:</label>
        <input type="number" id="price" value={pricePerRacket} onChange={(e) => setPricePerRacket(e.target.value)} /><br />

        
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export function StringSelect({ onStringChange, value, strings }) {
  const handleSelect = (event) => {
    const string_id = event.target.value;
    onStringChange(string_id);
  }
  
  return (
    <div>
      <label htmlFor='string'>String:</label>
      <select name="strings" id="string" value={value} required onChange={handleSelect}>
        <option value="">--Please choose a string--</option>
        {strings.map(string => (
          <option key={string.id} value={string.id}>{string.brand_name} {string.name}</option>
        ))}
      </select>
    </div>
    
  )
}