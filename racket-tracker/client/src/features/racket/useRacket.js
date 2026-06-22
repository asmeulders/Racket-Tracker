import axios from 'axios';

export function useRacket() {
  const createRacket = async ({ name, price, brandId }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/rackets", {
        name, price, brandId: brandId
      });
      return res;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else{
        console.error("Could not connect to server.");
      }
    }
  };

  const getRacket = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rackets/${id}`);
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
      await axios.delete(`http://localhost:5000/api/rackets/${id}`);
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
      const res = await axios.patch(`http://localhost:5000/api/rackets/${racketId}`, {
        'racketId': racketId,
        'brandId': brandId,
        'name': name,
        'price': price
      });
      console.log("res:", res);
      return res;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else{
        console.error("Could not connect to server.");
      }
    }
  }

  return { createRacket, getRacket, deleteRacket, updateRacket };
}