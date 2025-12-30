import { useState, useEffect } from 'react'
import axios from 'axios'


export function BrandList({brands}) {
    return(
        <div>
          <h2>Brands</h2>
          <ul>
            {brands.map(b => (
              <Brand key={b.id} brand={b}/>
            ))}
          </ul>
        </div>
    )
}

export function Brand({brand}) {
    return (
      <li >{brand.name}</li>
    )
}

export function BrandForm({ onBrandCreated }){
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-brand", {
        "name": name
      })
      
      setName('');

      onBrandCreated();
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
      <h2>Create a brand</h2>
      {error && <div>{error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>

        <label htmlFor="name">Brand Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />
        
        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}

export function BrandSelect({ onBrandChange, value, brands }) {
  const handleSelect = (event) => {
    const brand_id = event.target.value;

    onBrandChange(brand_id);
  }
  
  return (
    <div>
      <label htmlFor='brand'>Brand:</label>
      <select name="brands" id="brand" value={value} required onChange={handleSelect}>
        <option value="">--Please choose a brand--</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>{brand.name}</option>
        ))}
      </select>
    </div>
    
  )
}