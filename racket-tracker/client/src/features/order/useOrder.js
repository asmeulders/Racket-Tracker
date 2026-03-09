import axios from 'axios';

export function useOrder() {
    const createOrder = async ({ racketId, userId, stringId, tension, crossesId, crossesTension, sameForCrosses, paid }) => {
        try {
            await axios.post("http://localhost:5000/create-order", {
                "racket_id": racketId,
                "user_id": userId,
                "string_id": stringId,
                tension,
                "crosses_id": !sameForCrosses ? crossesId : null,
                "crosses_tension": !sameForCrosses ? crossesTension : null,
                "same_for_crosses": sameForCrosses,
                "paid": paid
            })
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    };

    const getOrderById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/get-order/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    }

    const deleteOrder = async (id) => {
        await axios.delete(`http://localhost:5000/delete-order/${id}`);
    };

    const completeOrder = async (order) => {
        try{
            const response = await axios.patch(`http://localhost:5000/complete-order/${order.id}`);
            return response.data.order.complete;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    }

    const orderPaid = async (order) => {
        try{
            const response = await axios.patch(`http://localhost:5000/pay-for-order/${order.id}`);
            return response.data.order.paid;
            } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    }

    return { createOrder, getOrderById, deleteOrder, completeOrder, orderPaid };
}