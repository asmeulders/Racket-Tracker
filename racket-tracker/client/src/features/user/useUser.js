import axios from 'axios';

export function useUser() {

    const createUser = async ({ name, pricePerRacket, brandId }) => {
        try {
            await axios.post("http://localhost:5000/create-user", {
                "username": username
            })
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
        
    };

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:5000/delete-user/${id}`);
    };

    return { createUser, deleteUser };
}