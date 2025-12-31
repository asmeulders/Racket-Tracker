import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './dashboard.css'

import { RacketList } from '../../components/racket/racket.jsx'
import { OrderList } from '../../components/order/order.jsx'
import { StringList } from '../../components/string/string.jsx'
import { UserList } from '../../components/user/user.jsx'
import { BrandList } from '../../components/brand/Brand.jsx'

function Dashboard() {
    const [users, setUsers] = useState([])
    const [rackets, setRackets] = useState([])
    const [orders, setOrders] = useState([])
    const [strings, setStrings] = useState([])
    const [brands, setBrands] = useState([])

    const fetchData = async () => {
        try {
        fetchUsers()
        fetchRackets()
        fetchStrings()
        fetchOrders()
        fetchBrands()
        } catch (error) {
        console.error("Error connecting to server:", error);
        }
    };

    const fetchRackets = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/rackets');
        setRackets(response.data);
        } catch (error) {
        console.error("Error fetching rackets:", error);
        }
    };

    const fetchStrings = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/strings');
        setStrings(response.data);
        } catch (error) {
        console.error("Error fetching strings:", error);
        }
    };

    const fetchOrders = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/orders');
        setOrders(response.data);
        } catch (error) {
        console.error("Error fetching orders:", error);
        }
    };

    const fetchUsers = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/users');
        setUsers(response.data);
        } catch (error) {
        console.error("Error fetching users:", error);
        }
    };

    const fetchBrands = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/brands');
        setBrands(response.data);
        } catch (error) {
        console.error("Error fetching brands:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className='dashboard-container'>
            <UserList users={users} onUserDeleted={fetchUsers} />
            <OrderList orders={orders} onOrderDeleted={fetchOrders} />
            <RacketList rackets={rackets} onRacketDeleted={fetchRackets} />
            <StringList strings={strings} onStringDeleted={fetchStrings} />
            <BrandList brands={brands} onBrandDeleted={fetchBrands} />         
        </div>
        
    )
}

export default Dashboard;