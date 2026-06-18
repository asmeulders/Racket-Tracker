import axios from 'axios';

export function useBrand() {

    const createBrand = async ({ name }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/brands", {
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

    const getBrand = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/brands/${id}`);
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
            await axios.delete(`http://localhost:5000/api/brands/${id}`);
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
            const res = await axios.patch(`http://localhost:5000/api/brands/${brandId}`, {
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

    return { createBrand, getBrand, deleteBrand, updateBrand };
}