import axios from 'axios';

export function useStore() {
    const deleteItem = async (type, id) => { 
        try {
            await axios.delete(`http://localhost:5000/api/${type}/${id}`);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    };

    return { deleteItem };
}