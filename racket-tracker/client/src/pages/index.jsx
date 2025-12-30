import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { RacketList, RacketForm } from '../components/racket/racket.jsx'
import { OrderList, OrderForm } from '../components/order/order.jsx'
import { StringList, StringForm } from '../components/string/string.jsx'
import { UserList, UserForm } from '../components/user/user.jsx'
import { BrandList, BrandForm } from '../components/brand/Brand.jsx'

const Home = () => {
    const [users, setUsers] = useState([])
    const [rackets, setRackets] = useState([])
    const [orders, setOrders] = useState([])
    const [strings, setStrings] = useState([])
    const [brands, setBrands] = useState([])

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

    const handleSubmit = () => {
        fetchOrders();
        fetchUsers();
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
            <div>
                <UserList users={users} />
                <OrderList orders={orders} />
            </div> 
            <div>
                <RacketList rackets={rackets}/>
                <StringList strings={strings} />
                <BrandList brands={brands} />
            </div>
        </div>

        <div style={{ display: "flex", gap: "50px" }}>
            <div>
                <UserForm onUserCreated={fetchUsers}/>
                <OrderForm onOrderCreated={handleSubmit} rackets={rackets} strings={strings}/>
            </div>
            <div>
                <RacketForm onRacketCreated={fetchRackets} brands={brands}/>
                <StringForm onStringCreated={fetchStrings} brands={brands}/>
                <BrandForm onBrandCreated={fetchBrands} />
            </div>
        </div>
    </div>
    )
}

export default Home;