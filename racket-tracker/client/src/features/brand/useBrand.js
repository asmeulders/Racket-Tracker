import axios from 'axios';

export function useBrand() {

    const createBrand = async ({ name }) => {
        try {
            await axios.post("http://localhost:5000/create-brand", {
                "name": name
            })
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
        
    };

    const deleteBrand = async (id) => {
        await axios.delete(`http://localhost:5000/delete-brand/${id}`);
    };

    return { createBrand, deleteBrand };
}