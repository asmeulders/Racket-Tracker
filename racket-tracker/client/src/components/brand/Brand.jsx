import { useState, useEffect } from 'react'
import axios from 'axios'
import './Brand.css';

export function Brand({brand}) {
  
  return (
      <li>{brand.name}</li>
  )
}

// export const BrandList = ({brands, onBrandDeleted}) => {
//   const [newBrands, setNewBrands] = useState(brands);

//   const deleteBrand = async (brand) => {
//     try {
//       console.log('Deleting brand', brand.name);
//       await axios.delete(`http://localhost:5000/delete-brand/${brand.id}`)

//       onBrandDeleted()
//     } catch (error) {
//       console.log("Error:", error)
//     }
//   }

//   useEffect(() => {
//     setNewBrands(brands)
//   }, [brands])

//   return(
//     <div>
//       <ul>
//         {newBrands.map(b => (
//           <div key={b.id} className='list-item'>
//             <Brand brand={b} onBrandDeleted={() => onBrandDeleted()} />
//             <button onClick={() => {deleteBrand(b)}}>X</button>
//           </div>
//         ))}
//       </ul>
//     </div>
//   )
// }


export const BrandForm = ({ onBrandCreated }) => {
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

export const BrandSelect = ({ onBrandChange, value, brands }) => {
  const handleSelect = (event) => {
    const brandId = event.target.value;
    onBrandChange(brandId);
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