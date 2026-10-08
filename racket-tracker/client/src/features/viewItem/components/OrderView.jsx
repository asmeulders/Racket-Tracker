import { useState, useEffect, forwardRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useOrder } from '../../order/index';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';
import { useViewItem } from '../useViewItem';
import { StorePageLayout } from '../../store';

export const OrderView = ({data, setData}) => {
    const navigate = useNavigate();
    const { getOrder, deleteOrder, updateOrder, completeOrder, orderPaid, orderPickUp } = useOrder();
    const { getList } = useViewItem();

    const [ order, setOrder ] = useState({});
    const [ updatedOrder, setUpdatedOrder ] = useState({});
    const [ isComplete, setIsComplete ] = useState(false);
    const [ isPaid, setIsPaid ] = useState(false);
    const [ isPickedUp, setIsPickedUp ] = useState(false);
    const [ showModal, setShowModal ] = useState({
        strings: false,
        rackets: false
    });
    const [editData, setEditData] = useState({
        rackets: [],
        strings: []
    });
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
    };

    const handleComplete = async () => {
        const res = await completeOrder(order);
        console.log(res);
        setIsComplete(res);
    };

    const handlePay = async () => {
        const res = await orderPaid(order);
        console.log(res);
        setIsPaid(res);
    };

    const handlePickUp = async () => {
        const res = await orderPickUp(order);
        console.log(res);
        setIsPickedUp(res);
    };

    const handleEdit = (field) => {
        // go to order form


        // getList(field)
        //     .then(data => setEditData(prev => ({ ...prev, [field]: data })))
        //     .finally(() => {
        //         setShowModal(prev => ({ ...prev, [field]: true })); 
        //         setUpdatedOrder({ 
        //             ...order, 
        //             mainsId: order.jobDetails[0].stringId,
        //             mainsTension: order.jobDetails[0].tension,
        //             crossesId: order.jobDetails?.[1]?.stringId,
        //             crossesTension: order.jobDetails?.[1]?.tension
        //         });
        //         console.log(order);
        //     });
    };

    const handleSave = (field) => {
        updateOrder(updatedOrder)
            .then(data => setOrder(data))
            .finally(() => setShowModal(prev => ({ ...prev, [field]: false})))
    };

    const handleDateChange = async (date) => {
        const fields = { id: order.id, due: date.toISOString() };
        updateOrder(fields)
            .then(data => {
                setOrder(data);
                console.log(data);
            });

        console.log(order);
    };

    return(
        <StorePageLayout 
            title={
                <>
                    Order #{order.id} |{" "}
                    <Link className="user-link" to={`/store/view-item/users/${order.userId}`}>{order.user.firstName} {order.user.lastName}</Link>
                </>
            }
            actions={
                <>
                    <button type="button" className="nav-btn" onClick={handleEdit}>Edit Order</button>
                    <button type="button" className="nav-btn" onClick={handleComplete}>{isComplete ? "Mark Incomplete" : "Mark Complete"} </button>
                </>
            }
        >
                
            {/* <button type="button" className="back-btn" onClick={() => navigate('/store/view-list/orders')}>&larr;</button> */}
            {/* <div className={`status ${statusClass}`}>{isComplete ? "Complete" : isLate ? "Overdue" : "To Do"}</div> */}
            
            <div className='item-page-content'>
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
                    <div>
                        <strong>Ordered on:</strong>
                        <span>{displayOrderDate}</span>
                    </div>
                    <div>
                        <strong>Total Cost:</strong><span>${order.totalCost}</span>
                        <button className="action-btn" onClick={handlePay}>{isPaid ? "Paid" : "Unpaid"}</button>
                    </div>
                    <button className="action-btn" onClick={handlePickUp}>{isPickedUp ? "Picked Up" : "Not Picked Up"}</button>
                </div>

                <h3>Job Details</h3>
                <h4 onClick={() => navigate(`/store/view-item/rackets/${order.racketId}`)}>{order.racketBrand} {order.racketName}</h4>

                {/* make a single edit order button */}
                <h4>Stringing</h4>
                <span>Service Price: {order.laborCost}</span>
                <StringDetails jobDetails={mains} sameForCrosses={order.sameForCrosses}/>
                {!order.sameForCrosses && 
                    <StringDetails jobDetails={crosses} sameForCrosses={order.sameForCrosses}/>}
            </div>
            {/* <UpdateModal show={showModal.rackets} data={updatedOrder} listData={editData.rackets} handleSave={() => handleSave('rackets')} handleClose={() => setShowModal(prev => ({...prev, rackets: false}))} field='rackets' onChange={setUpdatedOrder}/>    
            <UpdateModal show={showModal.strings} data={updatedOrder} listData={editData.strings} handleSave={() => handleSave('strings')} handleClose={() => setShowModal(prev => ({...prev, strings: false}))} field='strings' onChange={setUpdatedOrder}/>     */}
        </StorePageLayout>
    )
}


const StringDetails = ({jobDetails, sameForCrosses}) => {
    const price = sameForCrosses ? jobDetails.pricePerRacket : jobDetails.pricePerRacket / 2;

    return (
        <div className='stringing-details'>
            {!sameForCrosses && <h5>{jobDetails.direction}</h5>}
            <ul>
                <li>String: {jobDetails.stringBrand} {jobDetails.stringName}</li>
                <li>Tension: {jobDetails.tension}</li>
                <li>Price: {price}</li>
            </ul>
        </div>
    )
}

const UpdateModal = ({ show, data, listData, handleSave, handleClose, field, onChange }) => {
    const selects = {
        strings: <StringEdit data={data} listData={listData} onChange={onChange}/>,
        rackets: <RacketSelect onRacketChange={onChange} value={data.racketId} rackets={listData}/>
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit {field}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selects[field]}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal> 
    );
}

const StringEdit = ({ data, listData, onChange }) => {
    const jobDetails = Array.isArray(data.jobDetails) ? data.jobDetails : [data.jobDetails];
    const mains = jobDetails.find(j => j.direction === "Mains");
    const crosses = jobDetails.find(j => j.direction === "Crosses");

    return (
        <>
            <StringSelect onStringChange={onChange} value={data.mainsId} strings={listData} direction='mains'/>
        
            <Form.Group>
                <Form.Label>
                    Mains Tension:
                </Form.Label>
                <Form.Control 
                    type='number' 
                    id='tension' 
                    min={0}
                    max={100}
                    value={data.mainsTension} 
                    onChange={(e) => onChange(prev => ({ ...prev, mainsTension: e.target.value }))} 
                />
            </Form.Group>

            <Form.Check 
                type='checkbox'
                id="sameForCrosses"
                onChange={(e) => onChange(prev => ({ ...prev, sameForCrosses: e.target.checked}))}
                checked={data.sameForCrosses}
                label={data.sameForCrosses ? 'Same for crosses' : 'Different for crosses'}
            />
        
            {!data.sameForCrosses && 
            <div>
                <StringSelect onStringChange={onChange} value={data.crossesId} strings={listData} direction='crosses'/>
            
                <Form.Group>
                    <Form.Label>
                        Crosses Tension:
                    </Form.Label>
                    <Form.Control 
                        type='number' 
                        id='crossesTension' 
                        min={0}
                        max={100}
                        value={data.crossesTension} 
                        onChange={(e) => onChange(prev => ({ ...prev, crossesTension: e.target.value }))}
                    />
                </Form.Group>
            </div>
            }
        </>
    );
}

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
        className="due-date-trigger"
        onClick={onClick}
        ref={ref}
    >
        <span className='date-picker'>{value || 'Set due date'}</span>
    </button>
));

function toDatetimeLocalValue(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    // Adjust for local timezone offset so the input shows local time correctly
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset);
}