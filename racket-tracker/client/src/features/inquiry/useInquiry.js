import axios from 'axios';

export function useInquiry() {
  const createInquiry = async ({ name, phone, email, message }) => {
    try {
      await axios.post("http://localhost:5000/create-inquiry", {
        name, phone, email, message
      });
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else{
        console.error("Could not connect to server.");
      }
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-inquiry/${id}`);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
      } else{
        console.error("Could not connect to server.");
      }
    }
  };

  return { createInquiry, deleteInquiry };
}