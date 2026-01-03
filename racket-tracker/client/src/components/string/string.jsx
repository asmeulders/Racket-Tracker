import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrandSelect } from '../brand/Brand'

export function String({string}) {
  return (
    <li >
      {string.brand_name} {string.name} - ${string.price_per_racket} 
    </li>
  )
}

export const StringList = ({strings, onStringDeleted}) => {
  const [newStrings, setNewStrings] = useState(strings);

  const deleteString = async (string) => {
    try {
      await axios.delete(`http://localhost:5000/delete-string/${string.id}`)
      onStringDeleted();
      
    } catch (error) {
      console.log("Error:", error)
    }
  }

  useEffect(() => {
    setNewStrings(strings)
  }, [strings])

  return(
    <div>
      <ul>
        {newStrings.map(s => (
          <div key={s.id} >
            <String string={s} onStringDeleted={() => onStringDeleted()}/>
            <button onClick={() => {deleteString(s)}}>X</button>  
          </div>
        ))}
      </ul>
    </div>
  )
}



export const StringForm = ({ onStringCreated, brands }) => {
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
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
        "brand_id": brandId
      })
      
      setName('');
      setPricePerRacket('');
      setBrandId("");

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
        <BrandSelect value={brandId} brands={brands} onBrandChange={setBrandId} />

        <label htmlFor="name">String Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="price">Price per racket:</label>
        <input type="number" id="price" value={pricePerRacket} onChange={(e) => setPricePerRacket(e.target.value)} /><br />

        
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export const StringSelect = ({ onStringChange, value, strings }) => {
  const handleSelect = (event) => {
    const stringId = event.target.value;
    onStringChange(stringId);
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