import { useState, useEffect } from 'react';
import { OrderForm } from './Order';
import { fetchOrders, fetchRackets, fetchStrings, fetchUsers } from '../../common/db_utils';
import { useParams } from 'react-router-dom';
import axios from 'axios'


export function OrderPage() {
    const [orders, setOrders] = useState([])
    const [strings, setStrings] = useState([])
    const [rackets, setRackets] = useState([])
    const [users, setUsers] = useState([])

    const fetchAllData = async () => {
        try {
            fetchOrders({onComplete: setOrders});
            fetchRackets({onComplete: setRackets});
            fetchStrings({onComplete: setStrings});
            fetchUsers({onComplete: setUsers});
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    const handleSubmit = () => {
        try {
            fetchOrders({onComplete: setOrders});
            fetchUsers({onComplete: setUsers});
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);    

    return (
        <div>
            {/* <OrderList orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders})} /> */}
            <OrderForm onOrderCreated={handleSubmit} rackets={rackets} strings={strings} users={users}/>
        </div>
    );
};

export const EditOrderPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/get-order/${id}`)
        .then(res => setOrder(res.data));
    }, [id]);

    return(
        <div>
            <p>{order && order.id}</p>
        </div>
    )
}