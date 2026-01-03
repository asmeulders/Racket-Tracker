import React from 'react';
import { useState, useEffect } from 'react';
import './StoreDashboard.css';

import { RacketList } from '../racket/Racket.jsx'
import { OrderList } from '../order/Order.jsx'
import { StringList } from '../string/String.jsx'
import { UserList } from '../user/User.jsx'
import { BrandList } from '../brand/Brand.jsx'
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers } from '../../common/db_utils.js';

export function StoreDashboard() {
    const [users, setUsers] = useState([]);
    const [rackets, setRackets] = useState([]);
    const [orders, setOrders] = useState([]);
    const [strings, setStrings] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');

    const limit = 5;

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

    const renderContent = () => {
        switch(activeTab) {
            case 'orders':
                return <OrderList orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders, table:"orders", limit: limit})} />;
            case 'rackets':
                return <RacketList rackets={rackets} onRacketDeleted={() => fetchRackets({onComplete: setRackets, table: "rackets", limit: limit})} />;
            case 'strings':
                return <StringList strings={strings} onStringDeleted={() => fetchStrings({onComplete: setStrings, table: "strings", limit: limit})} />;
            case 'users':
                return <UserList users={users} onUserDeleted={() => fetchUsers({onComplete: setUsers, table: "users", limit: limit})} />;
            case 'brands':
                return <BrandList brands={brands} onBrandDeleted={() => fetchBrands({onComplete: setBrands, table: "brands", limit: limit})} />;
            default:
                return <OrderList orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders, table:"orders", limit: limit})} />;
        }
    }

    const getTabClass = (tabName) => {
        return `tab-button ${activeTab === tabName ? 'active' : ''}`;
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <div>
            <div className='dashboard-container'>
                <div className='tab-header'>
                    <button 
                        className={getTabClass('orders')} 
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                    <button 
                        className={getTabClass('rackets')} 
                        onClick={() => setActiveTab('rackets')}
                    >
                        Rackets
                    </button>
                    <button 
                        className={getTabClass('strings')} 
                        onClick={() => setActiveTab('strings')}
                    >
                        Strings
                    </button>
                    <button 
                        className={getTabClass('users')} 
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={getTabClass('brands')} 
                        onClick={() => setActiveTab('brands')}
                    >
                        Brands
                    </button>
                </div>
                <div id='content-box'>
                    {renderContent()}
                </div>
            </div>
        </div>
        
    )
}