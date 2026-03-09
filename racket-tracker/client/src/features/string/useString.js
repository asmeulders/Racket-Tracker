import axios from 'axios';

export function useString() {

    const createString = async ({ name, pricePerRacket, brandId }) => {
        try {
            await axios.post("http://localhost:5000/create-string", {
                name,
                "price_per_racket": pricePerRacket,
                "brand_id": brandId
            })
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
        
    };

    const deleteString = async (id) => {
        await axios.delete(`http://localhost:5000/delete-brand/${id}`);
    };

    return { createString, deleteString };
}