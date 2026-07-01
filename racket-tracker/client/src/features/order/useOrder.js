import axios from 'axios';

export function useOrder() {
    const createOrder = async (fields) => {
        try {
            const res = await axios.post("http://localhost:5000/api/orders", {
                "racketId": fields.racketId,
                "userId": fields.userId,
                "mainsId": fields.mainsId,
                "mainsTension": fields.mainsTension,
                "crossesId": !fields.sameForCrosses ? fields.crossesId : null,
                "crossesTension": !fields.sameForCrosses ? fields.crossesTension : null,
                "sameForCrosses": fields.sameForCrosses,
                "paid": fields.paid
            });
            console.log(res.data.order);
            return res.data.order;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    };

    const getOrder = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
            console.log("Res Data: ", res.data);
            return res.data;
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    }

    const deleteOrder = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${id}`);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else {
                console.error("Could not connect to server.");
            }
        }
    };

    const updateOrder = async (fields) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
                'orderId': fields.orderId,
                'userId': fields.userId,
                'racketId': fields.racketId,
                'mainsId': fields.mainsId,
                'mainsTension': fields.mainsTension,
                'crossesId': fields.crossesId,
                'crossesTension': fields.crossesTension,
                'sameForCrosses': fields.sameForCrosses,
                'paid': fields.paid,
                'due': fields.due,
                'price': fields.price
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

    const completeOrder = async (order) => {
        try{
            console.log("Completing order: ", order.id);
            const response = await axios.patch(`http://localhost:5000/api/toggle-complete/${order.id}`);
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
            const response = await axios.patch(`http://localhost:5000/api/pay-for-order/${order.id}`);
            return response.data.order.paid;
            } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    }

    const orderPickUp = async (order) => {
        try{
            console.log("Paying for order: ", order.id);
            const response = await axios.patch(`http://localhost:5000/api/pick-up-order/${order.id}`);
            return response.data.order.pickedUp;
            } catch (error) {
            if (error.response) {
                console.error(error.response.data.error);
            } else{
                console.error("Could not connect to server.");
            }
        }
    }



    return { createOrder, getOrder, deleteOrder, updateOrder, completeOrder, orderPaid, orderPickUp };
}