import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useOrder } from './index';
import { UserSelect } from '../user';
import { RacketSelect } from '../racket';
import { StringSelect } from '../string';
import { fetchData } from '../../utils/db_utils';

// TODO: update this page with new changes


export const OrderPage = () => {
    const navigate = useNavigate()
    const { getOrderById, deleteOrder, completeOrder, orderPaid, updatedOrder } = useOrder();
    const { orderId } = useParams();

    const [ loading, setLoading ] = useState(true);
    const [ order, setOrder ] = useState({});
    const [ updatedOrder, setUpdatedOrder ] = useState({});
    const [ isComplete, setIsComplete ] = useState(false);
    const [ isPaid, setIsPaid ] = useState(false);

    const [editData, setEditData] = useState({
        orders: [],
        users: [],
        rackets: [],
        strings: []
    });  

    const [ isEditing, setIsEditing ] = useState(false);

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
        console.log(order);
    }, [order]);

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found.</div>;

    const isLate = order && order.due && !order.complete && new Date(order.due) < new Date();

    const jobDetails = Array.isArray(order.jobDetails) ? order.jobDetails : [order.jobDetails];

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
        const tables = ['users', 'rackets', 'strings'];

        for (let i = 0; i < tables.length; i++) {
            const data = await fetchData({ table: tables[i] });
            setEditData(prev => ({ ...prev, [tables[i]]: data }));
        }
        setIsEditing(true);
    }

    const handleSave = async (field) => {
        console.log("Order saved: ", order);
        // update the order
        
        setIsEditing(false);
    }

    return(
        <div className="order-page">

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
                        <span>Ordered: {order.orderDate}</span>
                    </div> */}

                    <div className="order-details">
                        <div className='field-label'>
                            <label>Customer:</label>
                        </div>
                        <div>
                            {isEditing ? 
                                <UserSelect onUserChange={setOrder} value={order?.userId} users={editData.users} /> : 
                                <span>{order.username}</span>
                            }
                        </div>                      

                        <div className='field-label'>
                            <label>Racket:</label>
                        </div>
                        <div>
                            {isEditing ? 
                                <RacketSelect onRacketChange={setOrder} value={order?.racketId} rackets={editData.rackets} /> : 
                                <span>{order.racketBrand} {order.racketName}</span>
                            }
                        </div>

                        <div className='field-label'>
                            <label>Stringing:</label>
                        </div>
                        <div>
                            {isEditing ? 
                                <div>
                                    <StringSelect onStringChange={setOrder} value={order?.jobDetails[0].stringId} strings={editData.strings} />
                                    <input type="checkbox" onChange={(e) => setOrder(prev => ({ ...prev, sameForCrosses: e.target.checked}))} checked={order.sameForCrosses} />
                                    {!order?.sameForCrosses ?
                                        <StringSelect onStringChange={setOrder} value={order?.jobDetails[1]?.stringId} strings={editData.strings} /> : null
                                    } 
                                    {/* TODO: This above is suspicious */}
                                </div> : 
                                <div className='string-directions'>
                                    <span>(Mains) {mains?.stringBrand} {mains?.stringName} @ {mains?.tension}lbs</span>
                                    {crosses 
                                        ? <span> (Crosses) {crosses.stringBrand} {crosses.stringName} @ {crosses.tension}lbs</span>
                                        : <span> (Same for crosses)</span>
                                    }
                                </div> 
                            }
                        </div>

                        <div className='field-label'>
                            <label>Price:</label>   
                        </div>
                        <div>
                            {isEditing ? 
                                <input type="number" placeholder='Price' value={order.price} onChange={(e) => setOrder(prev => ({ ...prev, price: e.target.value }))}/> :
                                <span>${order.price}</span>
                            }
                        </div>
                    </div>
                    <div className='order-edit-btn'>
                        {isEditing ? 
                            <button onClick={() => handleSave("customer")}>Save</button> :
                            <button onClick={async () => await handleEdit("customer")}>Edit</button>
                        }
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