import React from 'react';
import { useState, useEffect } from 'react';
import './dashboard.css';

import { RacketList } from '../../components/racket/racket.jsx'
import { OrderList } from '../../components/order/order.jsx'
import { StringList } from '../../components/string/string.jsx'
import { UserList } from '../../components/user/user.jsx'
import { BrandList } from '../../components/brand/Brand.jsx'
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers } from '../../common/db_utils.js';

function Dashboard() {
    const [users, setUsers] = useState([])
    const [rackets, setRackets] = useState([])
    const [orders, setOrders] = useState([])
    const [strings, setStrings] = useState([])
    const [brands, setBrands] = useState([])

    const limit = 5

    const fetchAllData = async () => {
        try {
            fetchOrders({onComplete: setOrders, limit: limit});
            fetchRackets({onComplete: setRackets, limit: limit});
            fetchStrings({onComplete: setStrings, limit: limit});
            fetchBrands({onComplete: setBrands, limit: limit});
            fetchUsers({onComplete: setUsers, limit: limit});
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <div className='dashboard-container'>
            <UserList users={users} onUserDeleted={() => fetchUsers({onComplete: setUsers, table: "users", limit: limit})} />
            <OrderList orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders, table:"orders", limit: limit})} />
            <RacketList rackets={rackets} onRacketDeleted={() => fetchRackets({onComplete: setRackets, table: "rackets", limit: limit})} />
            <StringList strings={strings} onStringDeleted={() => fetchStrings({onComplete: setStrings, table: "strings", limit: limit})} />
            <BrandList brands={brands} onBrandDeleted={() => fetchBrands({onComplete: setBrands, table: "brands", limit: limit})} />         
        </div>
    )
}

export default Dashboard;