import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useOrder } from './index';

// export function OrderPage() {
//     const [orders, setOrders] = useState([])
//     const [strings, setStrings] = useState([])
//     const [rackets, setRackets] = useState([])
//     const [users, setUsers] = useState([])

//     const fetchAllData = async () => {
//         try {
//             fetchOrders({onComplete: setOrders});
//             fetchRackets({onComplete: setRackets});
//             fetchStrings({onComplete: setStrings});
//             fetchUsers({onComplete: setUsers});
//         } catch (error) {
//             console.error("Error connecting to server:", error);
//         }
//     };

//     const handleSubmit = () => {
//         try {
//             fetchOrders({onComplete: setOrders});
//             fetchUsers({onComplete: setUsers});
//         } catch (error) {
//             console.error("Error connecting to server:", error);
//         }
//     };

//     useEffect(() => {
//         fetchAllData();
//     }, []);    

//     return (
//         <div>
//             {/* <OrderList orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders})} /> */}
//             <OrderForm onOrderCreated={handleSubmit} rackets={rackets} strings={strings} users={users}/>
//         </div>
//     );
// };

export const OrderPage = () => {
    const { getOrderById } = useOrder();
    const { orderId } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ order, setOrder ]= useState(null);

    useEffect(() => {
        getOrderById(orderId)
            .then(data => setOrder(data))
            .finally(() => setLoading(false));

        
    }, [orderId])

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found.</div>;

    const isLate = order && order.due && !order.complete && new Date(order.due) < new Date();

    const jobDetails = Array.isArray(order.job_details) ? order.job_details : [order.job_details];

    const mains = jobDetails.find(j => j.direction === "mains") ?? jobDetails.find(j => j.direction === null);
    const crosses = jobDetails.find(j => j.direction === "crosses");

    return(
        <div className="order-page">

            {/* STATUS HEADER — green if complete, red if late, grey otherwise */}
            <div className={`order-header ${order?.complete ? "completed" : isLate ? "late" : ""}`}>
                <span>Order #{order.id}</span>
                <span>Status: {order.complete ? "Complete" : "To Do"}</span>
                <span>Paid: {order.paid ? "Paid" : "Unpaid"}</span>
                <span>Due: {order.due}</span>
            </div>

            {/* MAIN CARD */}
            <div className="order-card">

                {/* LEFT — photo + date ordered */}
                <div className="order-photo-section">
                    <div className="racket-photo">
                        {/* <img src={order.racket.photo} alt="Racket" /> */}
                    </div>
                    <span>Ordered: {order.order_date}</span>
                </div>

                {/* CENTER — editable fields */}
                <div className="order-details">
                    <div className="order-field">
                        <label>Customer</label>
                        <span>{order.user_name}</span>
                        <button>Edit</button>
                    </div>
                    <div className="order-field">
                        <label>Racket</label>
                        <span>{order.racket_name}</span>
                        <button>Edit</button>
                    </div>
                    <div className="order-field">
                        <label>Stringing</label>
                        <span>{mains?.string_brand} {mains?.string_name} @ {mains?.tension}lbs</span>
                        {crosses 
                            ? <span>{crosses.string_brand} {crosses.string_name} @ {crosses.tension}lbs (crosses)</span>
                            : <span>Same for crosses</span>
                        }
                        <button>Edit</button>
                    </div>
                    <div className="order-field">
                        <label>Price</label>
                        <span>${order.price}</span>
                        <button>Edit</button>
                    </div>
                </div>

                {/* RIGHT — action buttons */}
                <div className="order-actions">
                    <button className="btn-delete">Delete Order</button>
                    <button className="btn-complete">
                        {order.complete ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button className="btn-pay">Pay / Unpay</button>
                    <button className="btn-new-order">Create New Order</button>
                </div>

            </div>
        </div>
    )
}