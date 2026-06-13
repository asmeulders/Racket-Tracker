import axios from 'axios';

export function useOrder() {
    const createOrder = async ({ racketId, userId, mainsId, mainsTension, crossesId, crossesTension, sameForCrosses, paid }) => {
        try {
            const res = await axios.post("http://localhost:5000/create-order", {
                "racketId": racketId,
                "userId": userId,
                "mainsId": mainsId,
                "mainsTension": mainsTension,
                "crossesId": !sameForCrosses ? crossesId : null,
                "crossesTension": !sameForCrosses ? crossesTension : null,
                "sameForCrosses": sameForCrosses,
                "paid": paid
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
            console.log("Completing order: ", order.id);
            const response = await axios.patch(`http://localhost:5000/toggle-complete/${order.id}`);
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
            console.log("Paying for order: ", order.id);
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