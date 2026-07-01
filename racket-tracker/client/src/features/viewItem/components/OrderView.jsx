import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { format } from 'date-fns';

import { useOrder } from '../../order/index';
import { UserSelect } from '../../user';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';
import { useViewItem } from '../useViewItem';

export const OrderView = ({data, setData}) => {
    const navigate = useNavigate();
    const { getOrder, deleteOrder, updateOrder, completeOrder, orderPaid, orderPickUp } = useOrder();
    const { getList } = useViewItem();

    const [ order, setOrder ] = useState({});
    const [ updatedOrder, setUpdatedOrder ] = useState({});
    const [ isComplete, setIsComplete ] = useState(false);
    const [ isPaid, setIsPaid ] = useState(false);
    const [ isPickedUp, setIsPickedUp ] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const [editData, setEditData] = useState({
        orders: [],
        users: [],
        rackets: [],
        strings: []
    });
    const [ show, setShow ] = useState(false);

    useEffect(() => {
        setOrder(data);
    }, [data]);

    useEffect(() => {
        if (order !== null) {
            setIsComplete(order.complete);
            setIsPaid(order.paid);
            setIsPickedUp(order.pickedUp);
            console.log(order.jobDetails?.[0]);
        }
        
    }, [order]);

    if (Object.keys(order).length === 0) return <div>Order not found.</div>;

    const displayOrderDate = order.orderDate ? format(new Date(order.orderDate), 'MM/dd/yyyy') : null;
    const displayDueDate = order.due ? format(new Date(order.due), 'MM/dd/yyyy') : null;
    const isLate = order && order.due && !order.complete && new Date(order.due) < new Date();

    const jobDetails = Array.isArray(order.jobDetails) ? order.jobDetails : [order.jobDetails];

    const mains = jobDetails.find(j => j.direction === "mains") ?? jobDetails.find(j => j.direction === null);
    const crosses = jobDetails.find(j => j.direction === "crosses");

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this order?");

        if (confirmed) {
            await deleteOrder(order.id);
            navigate('/store/view-list/orders');
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

    const handlePickUp = async () => {
        const res = await orderPickUp(order);
        console.log(res);
        setIsPickedUp(res);
    }

    const handleEdit = async (field) => {
        const tables = ['users', 'rackets', 'strings'];

        for (let i = 0; i < tables.length; i++) {
            const data = await getList(tables[i]);
            setEditData(prev => ({ ...prev, [tables[i]]: data }));
        }

        navigate(`/store/edit-item/orders/${order.id}`)
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

            <div className="view-item-header">
                <button type="button" onClick={() => navigate('/store/view-list/orders')}>&larr;</button>
                <h1>Order #{order.id}</h1>
                <div>{isComplete ? "Complete" : isLate ? "Overdue" : "To Do"}</div>
                <button className="action-btn" onClick={handleComplete}>{isComplete ? "Mark Incomplete" : "Mark Complete"}</button>
            </div>

            <div className='view-item-section'>
                <h2>{order.user.firstName} {order.user.lastName}</h2>
                {/* edit user button */}
                <div>Due: {displayDueDate}</div>
                {/* edit date button */}
                <div>Ordered on: {displayOrderDate}</div>
            </div>
            
            <div className='view-item-section'>
                <div>
                    <span>Payment: {isPaid ? 'Paid' : 'Unpaid'}</span>
                    <button className="action-btn" onClick={handlePay}>{isPaid ? "Mark Unpaid" : "Mark Paid"}</button>
                </div>
                
                <div>
                    <span>Picked Up: {isPickedUp ? 'Picked Up' : 'Not Picked Up'}</span>
                    <button className="action-btn" onClick={handlePickUp}>{isPickedUp ? "Mark Not Picked Up" : "Mark Picked Up"}</button>
                </div>
            </div>

            <div className='view-item-section'>
                <h3>{order.racketBrand} {order.racketName}</h3>
                {/* edit racket button */}
            </div>

            <div className='view-item-section'>
                <h3>Stringing</h3>
                <div className='stringing-section'>
                    <StringDetails jobDetails={order.jobDetails[0]} sameForCrosses={order.sameForCrosses}/>
                    {!order.sameForCrosses && 
                        <StringDetails jobDetails={order.jobDetails[1]} sameForCrosses={order.sameForCrosses}/>}
                </div>
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
                                {
                                    !crosses ?
                                    <span>{mains?.stringBrand} {mains?.stringName} @ {mains?.tension}lbs</span>
                                    :
                                    <>
                                        <span>Mains: {mains?.stringBrand} {mains?.stringName} @ {mains?.tension}lbs</span><br />
                                        <span>Crosses: {crosses.stringBrand} {crosses.stringName} @ {crosses.tension}lbs</span>
                                    </>
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
                    <button className="action-btn" onClick={() => navigate('/store/new-item/orders')}>Create New Order</button>
                </div>  
            </div>                      
        </div>
    )
}


const StringDetails = ({jobDetails, sameForCrosses}) => {
    const price = sameForCrosses ? jobDetails.pricePerRacket : jobDetails.pricePerRacket / 2;

    return (
        <div className='stringing-details'>
            {!sameForCrosses && <h4>{jobDetails.direction}</h4>}
            <ul>
                <li>String: {jobDetails.stringBrand} {jobDetails.stringName}</li>
                <li>Tension: {jobDetails.tension}</li>
                <li>Price: {price}</li>
            </ul>
        </div>
    )
}