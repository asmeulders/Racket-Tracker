import { useState, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useOrder } from '../../order/index';
import { UserSelect } from '../../user';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';
import { useViewItem } from '../useViewItem';
import { SplitButton } from '../../../components/splitButton/SplitButton';

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
    const [ dueDate, setDueDate ] = useState(order.due ? new Date(order.due) : null);

    useEffect(() => {
        setOrder(data);
    }, [data]);

    useEffect(() => {
        if (order !== null) {
            setIsComplete(order.complete);
            setIsPaid(order.paid);
            setIsPickedUp(order.pickedUp);
            setDueDate(toDatetimeLocalValue(order.due));
            console.log(order.jobDetails?.[0]);
        }
        
    }, [order]);

    if (Object.keys(order).length === 0) return <div>Order not found.</div>;

    const displayOrderDate = order.orderDate ? format(new Date(order.orderDate), 'MM/dd/yyyy') : null;
    const displayDueDate = order.due ? format(new Date(order.due), 'MM/dd/yyyy') : null;
    const isLate = order && order.due && !order.complete && new Date(order.due) < new Date();

    const jobDetails = Array.isArray(order.jobDetails) ? order.jobDetails : [order.jobDetails];

    const mains = jobDetails.find(j => j.direction === "Mains");
    const crosses = jobDetails.find(j => j.direction === "Crosses");

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

    const handleDateChange = async (date) => {
        const fields = { orderId: order.id, due: date.toISOString() };
        updateOrder(fields)
            .then(data => {
                setOrder(data);
                console.log(data);
            });

        console.log(order);
    }

    const statusClass = isComplete ? "status-complete" : isLate ? "status-late" : "status-to-do";
    const dropdownActions = [
        {
            label: 'Delete Order',
            onClick: handleDelete
        },
        {
            label: 'Create New Order',
            onClick: () => navigate('/store/new-item/orders')
        }
    ]
    
    return(
        <div className="item-page">

            <div className="view-item-header">
                <button type="button" className="back-btn" onClick={() => navigate('/store/view-list/orders')}>&larr;</button>
                <h1>Order #{order.id} | <span className="user-link" onClick={() => navigate(`/store/view-item/users/${order.userId}`)}>{order.user.firstName} {order.user.lastName}</span></h1>
                <div className={`status ${statusClass}`}>{isComplete ? "Complete" : isLate ? "Overdue" : "To Do"}</div>
                <div className='complete-btn'><SplitButton className="complete-btn" label={isComplete ? "Mark Incomplete" : "Mark Complete"} onClick={handleComplete} dropdownActions={dropdownActions}></SplitButton></div>
            </div>

            <div className='view-item-section'>
                <div>
                    <span>Payment: {isPaid ? 'Paid' : 'Unpaid'}</span>
                    <button className="action-btn" onClick={handlePay}>{isPaid ? "Mark Unpaid" : "Mark Paid"}</button>
                    <div>
                        <span>Picked Up: {isPickedUp ? 'Picked Up' : 'Not Picked Up'}</span>
                        <button className="action-btn" onClick={handlePickUp}>{isPickedUp ? "Mark Not Picked Up" : "Mark Picked Up"}</button>
                    </div>
                </div>
                <div className='order-info-section'>
                    {/* edit user button */}
                    <div><strong>Due:</strong>
                        <DatePicker
                            selected={dueDate}
                            onChange={(date) => { setDueDate(date); handleDateChange(date); }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            dateFormat="MMM d, yyyy h:mm aa"
                            customInput={<CustomInput />}
                        />
                    </div>
                    {/* edit date button */}
                    <div><strong>Ordered on:</strong>{displayOrderDate}</div>
                    <div><strong>Total Cost:</strong>${order.totalCost}</div>
                </div>
            </div>

            <div className='view-item-section view-item-section-top'>
                <h3>{order.racketBrand} {order.racketName}</h3>
                <button type="button" id="edit-racket-btn" className='action-btn'>Change Racket</button>
            </div>

            <div className='view-item-section view-item-section-bottom'>
                <div className='stringing-header'>
                    <h3>Stringing</h3>
                    <button type="button" id="edit-stringing-btn" className='action-btn'>Edit Stringing</button>
                </div>
                <div className='stringing-section'>Service Price: {order.laborCost}</div>
                <div className='stringing-section'>
                    <StringDetails jobDetails={mains} sameForCrosses={order.sameForCrosses}/>
                    {!order.sameForCrosses && 
                        <StringDetails jobDetails={crosses} sameForCrosses={order.sameForCrosses}/>}
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

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    className="due-date-trigger"
    onClick={onClick}
    ref={ref}
  >
    <span>{value || 'Set due date'}</span>
  </button>
));

function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  // Adjust for local timezone offset so the input shows local time correctly
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset);
}