import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useOrder } from '../../order/index';
import { UserSelect } from '../../user';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';
import { useViewItem } from '../useViewItem';

export const OrderView = ({data, setData}) => {
    const navigate = useNavigate();
    const { getOrder, deleteOrder, updateOrder, completeOrder, orderPaid } = useOrder();
    const { getList } = useViewItem();

    const [ order, setOrder ] = useState({});
    const [ updatedOrder, setUpdatedOrder ] = useState({});
    const [ isComplete, setIsComplete ] = useState(false);
    const [ isPaid, setIsPaid ] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const [editData, setEditData] = useState({
        orders: [],
        users: [],
        rackets: [],
        strings: []
    });  

    useEffect(() => {
        setOrder(data);
    }, [data]);

    useEffect(() => {
        if (order !== null) {
            setIsComplete(order.complete);
            setIsPaid(order.paid);
        }
    }, [order]);

    if (Object.keys(order).length === 0) return <div>Order not found.</div>;

    const isLate = order && order.due && !order.complete && new Date(order.due) < new Date();

    const jobDetails = Array.isArray(order.jobDetails) ? order.jobDetails : [order.jobDetails];

    const mains = jobDetails.find(j => j.direction === "mains") ?? jobDetails.find(j => j.direction === null);
    const crosses = jobDetails.find(j => j.direction === "crosses");

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this order?");

        if (confirmed) {
            await deleteOrder(order.id);
            navigate('/store');
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
            const data = await getList(tables[i]);
            setEditData(prev => ({ ...prev, [tables[i]]: data }));
        }
        if (order.sameForCrosses) {
            setUpdatedOrder({...order, mainsId: order.jobDetails[0].stringId, mainsTension: order.jobDetails[0].tension});
        } else {
            setUpdatedOrder({
                ...order, 
                mainsId: order.jobDetails[0].stringId, 
                mainsTension: order.jobDetails[0].tension,
                crossesId: order.jobDetails[1].stringId, 
                crossesTension: order.jobDetails[1].tension,
            });
        }
        
        setIsEditing(true);
    }

    const handleSave = async (field) => {
        const res = await updateOrder({
            orderId: order.id,
            userId: updatedOrder.userId,
            racketId: updatedOrder.racketId,
            mainsId: updatedOrder.mainsId,
            mainsTension: updatedOrder.mainsTension,
            crossesId: updatedOrder.crossesId,
            crossesTension: updatedOrder.crossesTension,
            sameForCrosses: updatedOrder.sameForCrosses,
            due: updatedOrder.due,
            price: updatedOrder.price
        });
        setData(res.data.order);
        setUpdatedOrder({});
        setIsEditing(false);
    }

    return(
        <div className="item-page">

            <div className={`order-header ${isComplete ? "order-header--complete" : isLate ? "order-header--late" : ""}`}>
                <div>Status: {isComplete ? "Complete" : isLate ? "Overdue" : "To Do"}</div>
                <div>Paid: {isPaid ? "Paid" : "Unpaid"}</div>
                <div>Due: {order.due}</div>
            </div>

            <div className="item-card">

                {/* <div className="order-photo-section">
                    <div className="racket-photo">
                        <img src={order.racket.photo} alt="Racket" />
                    </div>
                    <span>Ordered: {order.orderDate}</span>
                </div> */}

                <div className="item-fields">
                    <span className='field-label'>Customer:</span>
                    <div>
                        {isEditing ? 
                            <UserSelect onUserChange={setUpdatedOrder} value={updatedOrder?.userId} users={editData.users} /> : 
                            <span className='field-details'>{order.user.firstName} {order.user.lastName}</span>
                        }
                    </div>                      

                    <span className='field-label'>Racket:</span>
                    <div>
                        {isEditing ? 
                            <RacketSelect onRacketChange={setUpdatedOrder} value={updatedOrder?.racketId} rackets={editData.rackets} /> : 
                            <span className='field-details'>{order.racketBrand} {order.racketName}</span>
                        }
                    </div>

                    <label className='field-label'>Stringing:</label>
                    <div>
                        {isEditing ? 
                            <div>
                                <div>
                                    <StringSelect onStringChange={setUpdatedOrder} value={updatedOrder?.mainsId} strings={editData.strings} direction={'mains'} />
                                    <input type="number" value={updatedOrder?.mainsTension} placeholder='Mains Tension' onChange={(e) => setUpdatedOrder(prev => ({...prev, mainsTension: e.target.value}))} />
                                </div>
                                
                                <input type="checkbox" onChange={(e) => setUpdatedOrder(prev => ({ ...prev, sameForCrosses: e.target.checked}))} checked={updatedOrder.sameForCrosses} />
                                {!updatedOrder?.sameForCrosses ?
                                    <div>
                                        <StringSelect onStringChange={setUpdatedOrder} value={updatedOrder?.crossesId} strings={editData.strings} direction={'crosses'} />
                                        <input type="number" value={updatedOrder?.crossesTension} placeholder='Crosses Tension' onChange={(e) => setUpdatedOrder(prev => ({...prev, crossesTension: e.target.value}))} />
                                    </div> : null
                                } 
                            </div> : 
                            <div className='field-details'>
                                <span>(Mains) {mains?.stringBrand} {mains?.stringName} @ {mains?.tension}lbs</span>
                                {crosses 
                                    ? <span> (Crosses) {crosses.stringBrand} {crosses.stringName} @ {crosses.tension}lbs</span>
                                    : <span> (Same for crosses)</span>
                                }
                            </div> 
                        }
                    </div>

                    <label className='field-label'>Price:</label>   
                    <div>
                        {isEditing ? 
                            <input type="number" step='0.01' min='0' placeholder='Price' value={updatedOrder.price} onChange={(e) => setUpdatedOrder(prev => ({ ...prev, price: e.target.value }))}/> :
                            <span className='field-details'>${order.price}</span>
                        }
                    </div>

                    <span className='field-label'>Due Date:</span>
                    <div>
                        {isEditing ? 
                            <input type='date' value={updatedOrder.due} onChange={(e) => setUpdatedOrder(prev => ({...prev, due: e.target.value}))} />
                            : <span className='field-details'>{order.due}</span>
                        }
                    </div>
                </div>
                <div className="item-actions">
                    {isEditing ? 
                        <button className="action-btn" onClick={() => handleSave()}>Save</button> :
                        <button className="action-btn" onClick={async () => await handleEdit()}>Edit</button>
                    }
                    <button className="action-btn" onClick={handleDelete}>Delete Order</button>
                    <button className="action-btn" onClick={handleComplete}>
                        {isComplete ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button className="action-btn" onClick={handlePay}>
                        {isPaid ? "Mark Unpaid" : "Mark Paid"}
                    </button>
                    <button className="action-btn">Create New Order</button>
                </div>  
            </div>                      
        </div>
    )
}