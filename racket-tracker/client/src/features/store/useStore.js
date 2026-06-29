import axios from 'axios';

export function useStore() {
    const getPage = async (type, page, limit, filters) => {
        try {
            const res = await axios.post(`http://127.0.0.1:5000/api/${type}/search?page=${page}&limit=${limit}`, {
                filters: filters
            });
            return res.data;
        } catch (error) {
            console.log("caught error: ", error);
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server");
            }
        } 
    }

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

    const getSettings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/store-settings');
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    }

    const updateSettings = async (settings) => {
        try {
            const res = await axios.put('http://localhost:5000/api/store-settings', settings);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    }

    return { getPage, deleteItem, getSettings, updateSettings };
}