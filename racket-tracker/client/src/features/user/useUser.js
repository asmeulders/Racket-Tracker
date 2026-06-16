import axios from 'axios';

export function useUser() {

    const createUser = async ({ username, firstName, lastName, phone, email }) => {
        try {
            const res = await axios.post("http://localhost:5000/create-user", {
                "username": username,
                'firstName': firstName,
                'lastName': lastName,
                'phone': phone,
                'email': email
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

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:5000/delete-user/${id}`);
    };

    return { createUser, deleteUser };
}