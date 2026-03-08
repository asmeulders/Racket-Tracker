import axios from 'axios';

export function useRackets() {
  const createRacket = async ({ name, price, brandId }) => {
    try {
      await axios.post("http://localhost:5000/create-racket", {
      name, price, brand_id: brandId
    });
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else{
        setError("Could not connect to server.");
      }
    }
    
  };

  const deleteRacket = async (id) => {
    await axios.delete(`http://localhost:5000/delete-racket/${id}`);
  };

  return { createRacket, deleteRacket };
}