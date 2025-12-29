import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './dashboard.css'

import { RacketList } from '../../components/racket/racket.jsx'
import { OrderList } from '../../components/order/order.jsx'
import { StringList } from '../../components/string/string.jsx'
import { User, UserList } from '../../components/user/user.jsx'

function Dashboard() {
    const [users, setUsers] = useState([])
    const [rackets, setRackets] = useState([])
    const [orders, setOrders] = useState([])
    const [strings, setStrings] = useState([])

    const fetchData = async () => {
        try {
        const userRes = await axios.get('http://127.0.0.1:5000/users/5');
        setUsers(userRes.data);

        const racketRes = await axios.get('http://127.0.0.1:5000/rackets/5');
        setRackets(racketRes.data);

        const stringRes = await axios.get('http://127.0.0.1:5000/strings/5');
        setStrings(stringRes.data);

        const orderRes = await axios.get('http://127.0.0.1:5000/orders/5');
        setOrders(orderRes.data);
        } catch (error) {
        console.error("Error connecting to server:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className='dashboard-container'>
            <OrderList orders={orders}/>
            <RacketList rackets={rackets} />
            <StringList strings={strings} />
            <UserList users={users} />           
        </div>
        
    )
}

export default Dashboard;