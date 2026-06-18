import axios from 'axios';

export function useRacket() {
  const createRacket = async ({ name, price, brandId }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/create-racket", {
        name, price, brandId: brandId
      });
      return res;
    } catch (error) {
      if (error.response) {
        console.err(error.response.data.error);
      } else{
        console.err("Could not connect to server.");
      }
    }
  };

  const getRacketById = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/get-racket-by-id/${id}`);
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else {
        console.error("Could not connect to server");
      }
    } 
  }

  const deleteRacket = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-racket/${id}`);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else {
        console.error("Could not connect to server.");
      }
    }
  };

  const updateRacket = async ({racketId, brandId, name, price}) => {
    try {
      const res = await axios.post("http://localhost:5000/api/update-racket", {
        'racketId': racketId,
        'brandId': brandId,
        'name': name,
        'price': price
      });
      return res;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else{
        console.error("Could not connect to server.");
      }
    }
  }

  return { createRacket, getRacketById, deleteRacket, updateRacket };
}