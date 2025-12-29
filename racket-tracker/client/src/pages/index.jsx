import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { RacketList, RacketForm } from '../components/racket/racket.jsx'
import { OrderList, OrderForm } from '../components/order/order.jsx'
import { StringList, StringForm } from '../components/string/string.jsx'
import { UserList, UserForm } from '../components/user/user.jsx'

const Home = () => {
    const [users, setUsers] = useState([])
    const [rackets, setRackets] = useState([])
    const [orders, setOrders] = useState([])
    const [strings, setStrings] = useState([])

    const initDatabases = async () => {
        try {
        await axios.post('http://127.0.0.1:5000/init_db');
        alert("Databases Created & Seeded!");
        fetchData();
        } catch (error) {
        console.error("Error initializing DB:", error);
        }
    };

    const fetchData = async () => {
        try {
        fetchUsers()
        fetchRackets()
        fetchStrings()
        fetchOrders()
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
        console.error("Error fetching rackets:", error);
        }
    };

    const fetchOrders = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/orders');
        setOrders(response.data);
        } catch (error) {
        console.error("Error fetching rackets:", error);
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

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
            Initialize & Seed Databases
        </button>

        <div style={{ display: "flex", gap: "50px" }}>
            
            <UserList users={users} />

            <RacketList rackets={rackets}/>

            <OrderList orders={orders} />

            <StringList strings={strings} />

        </div>

        <div>
            <UserForm onUserCreated={fetchUsers}/>

            <RacketForm onRacketCreated={fetchRackets}/>

            <OrderForm onOrderCreated={fetchOrders}/>

            <StringForm onStringCreated={fetchStrings}/>
        </div>
    </div>
    )
}

export default Home;