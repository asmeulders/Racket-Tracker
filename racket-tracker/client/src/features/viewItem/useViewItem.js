import axios from 'axios';

export function useViewItem() {
    const getItem = async (type, id) => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/${type}/${id}`);
            return res.data;
        } catch (error) {
            console.log("caught error: ", error);
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server");
            }
        } 
    };

    const getList = async (type) => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/list/${type}`);
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

    return { getItem, getList };
}