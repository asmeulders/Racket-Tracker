import axios from 'axios';

export function useUser() {

    const createUser = async ({ username, firstName, lastName, phone, email }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/users", {
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

    const getUser = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server");
            }
        } 
    }

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    };

    const updateUser = async ({userId, username, firstName, lastName, phone, email}) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/users/${userId}`, {
                'userId': userId,
                'username': username,
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
    }

    return { createUser, getUser, deleteUser, updateUser };
}