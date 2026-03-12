import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import { useOrder } from './index';

export const OrderPage = () => {
    const navigate = useNavigate()
    const { getOrderById, deleteOrder } = useOrder();
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

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this order?");

        if (confirmed) {
            deleteOrder(orderId);
            navigate('/store-dashboard');
        }
    }



    return(
        <div className="order-page">

            <div className={`order-header ${order?.complete ? "order-header--complete" : isLate ? "order-header--late" : ""}`}>
                <div>Status: {order.complete ? "Complete" : isLate ? "Overdue" : "To Do"}</div>
                <div>Paid: {order.paid ? "Paid" : "Unpaid"}</div>
                <div>Due: {order.due}</div>
            </div>

            <div className='order-page-content'>
                <div className="order-card">

                    {/* <div className="order-photo-section">
                        <div className="racket-photo">
                            <img src={order.racket.photo} alt="Racket" />
                        </div>
                        <span>Ordered: {order.order_date}</span>
                    </div> */}

                    <div className="order-details">
                        <div className='field-label'>
                            <label>Customer:</label>
                        </div>
                        <span>{order.user_name}</span>
                        <button>Edit</button>

                        <div className='field-label'>
                            <label>Racket:</label>
                        </div>
                        <span>{order.racket_name}</span>
                        <button>Edit</button>

                        <div className='field-label'>
                            <label>Stringing:</label>
                        </div>
                        <div className='string-directions'>
                            <span>(Mains) {mains?.string_brand} {mains?.string_name} @ {mains?.tension}lbs</span>
                            {crosses 
                                ? <span> (Crosses) {crosses.string_brand} {crosses.string_name} @ {crosses.tension}lbs</span>
                                : <span> (Same for crosses)</span>
                            }
                        </div>
                        <button>Edit</button>

                        <div className='field-label'>
                            <label>Price:</label>   
                        </div>
                        <span>${order.price}</span>
                        <button>Edit</button>
                    </div>
                </div>

                <div className="order-actions">
                    <button className="btn-delete" onClick={handleDelete}>Delete Order</button>
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