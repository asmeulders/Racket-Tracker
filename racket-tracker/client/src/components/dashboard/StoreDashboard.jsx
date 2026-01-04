import React from 'react';
import { useState, useEffect } from 'react';
import './StoreDashboard.css';

import { RacketList } from '../racket/Racket.jsx'
import { OrderList, OrderTabContent } from '../order/Order.jsx'
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
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [limit, setLimit] = useState(1);
    const [pageData, setPageData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);

    const fetchAllData = async () => {
        try {
            fetchOrders({onComplete: setOrders});
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
                console.log('orders', orders);
                return <OrderTabContent orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders, limit: limit})} currentPage={currentPage} limit={limit}/>;
            case 'rackets':
                return <RacketList rackets={rackets} onRacketDeleted={() => fetchRackets({onComplete: setRackets, limit: limit})} />;
            case 'strings':
                return <StringList strings={strings} onStringDeleted={() => fetchStrings({onComplete: setStrings, limit: limit})} />;
            case 'users':
                return <UserList users={users} onUserDeleted={() => fetchUsers({onComplete: setUsers, limit: limit})} />;
            case 'brands':
                return <BrandList brands={brands} onBrandDeleted={() => fetchBrands({onComplete: setBrands, limit: limit})} />;
            default:
                return <OrderList orders={orders} onOrderDeleted={() => fetchOrders({onComplete: setOrders, limit: limit})} />;
        }
    }

    const getTabClass = (tabName) => {
        return `tab-button ${activeTab === tabName ? 'active' : ''}`;
    };

    const handleSelect = (event) => {
        const selectedLimit = event.target.value;
        setLimit(selectedLimit);
    };

    const goLeft = () => {
        if (currentPage <= 0) {
            return;
        } else {
            setCurrentPage(currentPage-1);
            renderContent();
        }
    };

    const goRight = () => {
        if (currentPage >= maxPage) {
            return;
        } else {
            setCurrentPage(currentPage+1);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        setMaxPage(Math.ceil(orders.length / limit));
        console.log(maxPage);
    }, [orders]);

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
                <div id='query-info-container'>
                    <p id='query-info'>
                        Queried {activeTab} - showing
                        <select name="numResults" id="num-results" value={limit} onChange={handleSelect}>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select> 
                        per page.
                        <button onClick={goLeft}>Left</button>
                        {currentPage+1}
                        <button onClick={goRight}>Right</button>
                    </p>
                </div>
            </div>
        </div>
        
    )
}