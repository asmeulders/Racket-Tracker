import { useState, useEffect } from 'react'
import axios from 'axios'
import './Racket.css'

import { BrandSelect } from '../brand/Brand'

export function Racket({racket}) {
  return (
    <div className='racket-container'>
      {racket.brand_name} {racket.name} - ${racket.price}
    </div>
  )
}

// export const RacketList = ({rackets, onRacketDeleted}) => {
//   const [newRackets, setNewRackets] = useState(rackets);

//   const deleteRacket = async (racket) => {
//     try {
//       await axios.delete(`http://localhost:5000/delete-racket/${racket.id}`)

//       onRacketDeleted()
//     } catch (error) {
//       console.log("Error:", error)
//     }
//   }

//   useEffect(() => {
//     setNewRackets(rackets)
//   }, [rackets])

//     return(
//         <div>
//           <ul>
//             {newRackets.map(r => (
//               <div key={r.id} >
//                 <Racket racket={r} onRacketDeleted={() => onRacketDeleted()} />
//                 <button onClick={() => {deleteRacket(r)}}>X</button>   
//               </div>
//             ))}
//           </ul>
//         </div>
//     )
// }

export const RacketForm = ({ onRacketCreated, brands }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brandId, setBrandId] = useState('');

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
        "brand_id": brandId
      })
      
      setName('');
      setPrice('');
      setBrandId('');

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
        <BrandSelect value={brandId} brands={brands} onBrandChange={setBrandId} />

        <label htmlFor="name">Racket Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export const RacketSelect = ({ onRacketChange, value, rackets }) => {
  const handleSelect = (event) => {
    const racketId = event.target.value;
    onRacketChange(racketId);
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

export const RacketFilter = ({onFilterChange}) => {
  /**
   * The filter component for a racket in the dashboard.
   * Filters:
   *  - Brand Name
   *  - Racket Name
   *  - Price range
   */
  const [brandName, setBrandName] = useState('')
  const [racketName, setRacketName] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'brand_name': brandName,
      'racket_name': racketName,
      'price_min': priceMin,
      'price_max': priceMax
    })
  }, [brandName, racketName, priceMin, priceMax])

  return (
    <div className='filter-container'>
      <input type="text" placeholder='Brand Name' onChange={(e) => setBrandName(e.target.value)}/>
      <input type="text" placeholder='Racket Name' onChange={(e) => setRacketName(e.target.value)}/>
      <input type="number" placeholder='Price Min' onChange={(e) => setPriceMin(e.target.value)}/>
      <input type="number" placeholder='Price Max' onChange={(e) => setPriceMax(e.target.value)}/>
    </div>
  );
};