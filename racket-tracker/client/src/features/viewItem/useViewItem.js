export function useViewItem() {
    const getItem = async (type, id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/${type}/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server");
            }
        } 
    };

    return { getItem };
}