import axios from 'axios';

export function useBrand() {

    const createBrand = async ({ name }) => {
        try {
            const res = await axios.post("http://localhost:5000/create-brand", {
                "name": name
            })
            return res;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    };

    const getBrandById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/get-brand-by-id/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server");
            }
        } 
    }

    const deleteBrand = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete-brand/${id}`);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    };

    const updateBrand = async ({brandId, name}) => {
        try {
            const res = await axios.post("http://localhost:5000/update-brand", {
                'brandId': brandId,
                'name': name
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

    return { createBrand, getBrandById, deleteBrand, updateBrand };
}