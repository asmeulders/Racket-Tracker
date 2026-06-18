import axios from 'axios';

export function useString() {

    const createString = async ({ name, pricePerRacket, brandId }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/create-string", {
                'name': name,
                "pricePerRacket": pricePerRacket,
                "brandId": brandId
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

    const getStringById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/get-string-by-id/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server");
            }
        } 
    }

    const deleteString = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/delete-string/${id}`);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    };

    const updateString = async ({stringId, brandId, name, pricePerRacket}) => {
        try {
            const res = await axios.post("http://localhost:5000/api/update-string", {
                'stringId': stringId,
                'brandId': brandId,
                'name': name,
                'pricePerRacket': pricePerRacket
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

    return { createString, getStringById, deleteString, updateString };
}