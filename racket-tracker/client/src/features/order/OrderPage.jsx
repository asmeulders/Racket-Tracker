import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import { useOrder } from './index';
import { UserSelect } from '../user';
import { fetchUsers, fetchRackets, fetchStrings, fetchOrders } from '../../utils/db_utils'

export const OrderPage = () => {
    const navigate = useNavigate()
    const { getOrderById, deleteOrder, completeOrder, orderPaid } = useOrder();
    const { orderId } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ order, setOrder ] = useState(null);
    const [ isComplete, setIsComplete ] = useState(false);
    const [ isPaid, setIsPaid ] = useState(false);

    const [ users, setUsers ] = useState(null);
    const [ rackets, setRackets ] = useState(null);
    const [ strings, setStrings ] = useState(null);
    const [ orders, setOrders ] = useState(null);

    const [ isEditing, setIsEditing ] = useState({
        customer: false,
        racket: false,
        string: false,
        price: false
    })

    useEffect(() => {
        getOrderById(orderId)
            .then(data => setOrder(data))
            .finally(() => setLoading(false));

        
    }, [orderId])

    useEffect(() => {
        if (order !== null) {
            setIsComplete(order.complete);
            setIsPaid(order.paid);
        }
    }, [order]);

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

    const handleComplete = async () => {
        const res = await completeOrder(order);
        console.log(res);
        setIsComplete(res);
    }

    const handlePay = async () => {
        const res = await orderPaid(order);
        console.log(res);
        setIsPaid(res);
    }

    const handleEdit = async (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));

        switch (field) {
            case "customer":
                await fetchUsers({ onComplete: setUsers });
                break;
            case "racket":
                await fetchRackets({ onComplete: setRackets });
                break;
            case "string":
                await fetchStrings({ onComplete: setStrings });
                break;
            case "price":
                await fetchOrders({ onComplete: setOrders });
                break;
        }
    }

    const handleSave = (field) => {
        console.log("Order saved: ", order);
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    }

    const handleUserChange = (userId) => {
        setOrder(prev => ({ ...prev, user_id: userId}));
    }

    return(
        <div className="order-page"><span>{order.user_name}</span><span>{order.user_name}</span>

            <div className={`order-header ${isComplete ? "order-header--complete" : isLate ? "order-header--late" : ""}`}>
                <div>Status: {isComplete ? "Complete" : isLate ? "Overdue" : "To Do"}</div>
                <div>Paid: {isPaid ? "Paid" : "Unpaid"}</div>
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
                        <div>
                            {isEditing["customer"] ? 
                                <UserSelect onUserChange={handleUserChange} value={order?.user_id} users={users} /> : 
                                <span>{order.user_name}</span>}
                        </div>
                        <div>
                            {isEditing["customer"] ? <button onClick={() => handleSave("customer")}>Save</button> :
                            <button onClick={async () => await handleEdit("customer")}>Edit</button>}
                        </div>
                        

                        <div className='field-label'>
                            <label>Racket:</label>
                        </div>
                        <span>{order.racket_name}</span>
                        <div>
                            {isEditing["racket"] ? <button onClick={() => handleSave("racket")}>Save</button> :
                            <button onClick={() => handleEdit("racket")}>Edit</button>}
                        </div>

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
                        <div>
                            {isEditing["string"] ? <button onClick={() => handleSave("string")}>Save</button> :
                            <button onClick={() => handleEdit("string")}>Edit</button>}
                        </div>

                        <div className='field-label'>
                            <label>Price:</label>   
                        </div>
                        <span>${order.price}</span>
                        <div>
                            {isEditing["price"] ? <button onClick={() => handleSave("price")}>Save</button> :
                            <button onClick={() => handleEdit("price")}>Edit</button>}
                        </div>
                    </div>
                </div>

                <div className="order-actions">
                    <button className="btn-delete" onClick={handleDelete}>Delete Order</button>
                    <button className="btn-complete" onClick={handleComplete}>
                        {isComplete ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button className="btn-pay" onClick={handlePay}>
                        {isPaid ? "Mark Unpaid" : "Mark Paid"}
                    </button>
                    <button className="btn-new-order">Create New Order</button>
                </div>

            </div>

            
        </div>
    )
}