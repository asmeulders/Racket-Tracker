import axios from 'axios';

export function useInquiry() {
  const createInquiry = async ({ name, phone, email, message }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/inquiries", {
        name, phone, email, message
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

  const getInquiry = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/inquiries/${id}`);
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else {
        console.error("Could not connect to server");
      }
    } 
  }

  const deleteInquiry = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${id}`);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else{
        console.error("Could not connect to server.");
      }
    }
  };

  return { createInquiry, getInquiry, deleteInquiry };
}