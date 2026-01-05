import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './StoreDashboard.css';

import { Racket, RacketForm } from '../racket/Racket.jsx'
import { Order, OrderForm } from '../order/Order.jsx'
import { String, StringForm } from '../string/String.jsx'
import { User, UserForm } from '../user/User.jsx'
import { Brand, BrandForm } from '../brand/Brand.jsx'
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers } from '../../common/db_utils.js';

export function StoreDashboard() {
    const [users, setUsers] = useState([]);
    const [rackets, setRackets] = useState([]);
    const [orders, setOrders] = useState([]);
    const [strings, setStrings] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activeTab, setActiveTab] = useState('order');
    const [limit, setLimit] = useState(25);
    const [currentPage, setCurrentPage] = useState(0);

    const initDatabases = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/init_db');
            alert("Databases Created & Seeded!");
        } catch (error) {
            console.error("Error initializing DB:", error);
        }
    };

    const fetchAllData = async () => {
        try {
            fetchOrders({onComplete: setOrders});
            fetchRackets({onComplete: setRackets});
            fetchStrings({onComplete: setStrings});
            fetchBrands({onComplete: setBrands});
            fetchUsers({onComplete: setUsers});
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    const getCurrentData = () => {
        switch (activeTab) {
            case 'order': return orders;
            case 'racket': return rackets;
            case 'string': return strings;
            case 'user': return users;
            case 'brand': return brands;
            default: return [];
        }
    };

    const currentData = getCurrentData();
    const maxPage = Math.max(1, Math.ceil(currentData.length / limit));

    const tabConfig = {
        order: {
            renderItem: (item, handleDelete) => <Order order={item} onDelete={(item) => handleDelete(item)} />,
            refetch: () => fetchOrders({ onComplete: setOrders })
        },
        racket: {
            renderItem: (item) => <Racket racket={item} />,
            refetch: () => fetchRackets({ onComplete: setRackets })
        },
        string: {
            renderItem: (item) => <String string={item} />,
            refetch: () => fetchStrings({ onComplete: setStrings })
        },
        user: {
            renderItem: (item) => <User user={item} />,
            refetch: () => fetchUsers({ onComplete: setUsers })
        },
        brand: {
            renderItem: (item) => <Brand brand={item} />,
            refetch: () => fetchBrands({ onComplete: setBrands })
        }
    };

    const getTabClass = (tabName) => {
        return `tab-button ${activeTab === tabName ? 'active' : ''}`;
    };

    const handleSelect = (event) => {
        setLimit(Number(event.target.value));
        setCurrentPage(0);
    };

    const handleClick = (selectedTab) => {
        setActiveTab(selectedTab);
        setCurrentPage(0);
    }

    const goLeft = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const goRight = () => {
        setCurrentPage(prev => Math.min(maxPage - 1, prev + 1));
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const currentTabConfig = tabConfig[activeTab] || tabConfig.order;

    return (
        <div className='store-dashboard-page'>
            <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
                Initialize & Seed Databases
            </button>
            <div className='dashboard-container'>
                <FilterSearch />
                <div className='main-content'>
                    <div className='tab-header'>
                        <button 
                            className={getTabClass('order')} 
                            onClick={() => handleClick('order')}
                        >
                            Orders
                        </button>
                        <button 
                            className={getTabClass('racket')} 
                            onClick={() => handleClick('racket')}
                        >
                            Rackets
                        </button>
                        <button 
                            className={getTabClass('string')} 
                            onClick={() => handleClick('string')}
                        >
                            Strings
                        </button>
                        <button 
                            className={getTabClass('user')} 
                            onClick={() => handleClick('user')}
                        >
                            Users
                        </button>
                        <button 
                            className={getTabClass('brand')} 
                            onClick={() => handleClick('brand')}
                        >
                            Brands
                        </button>
                    </div>
                    <div className='content-box'>
                        <TabContent
                            data={currentData}
                            renderItem={currentTabConfig.renderItem}
                            onDataDeleted={currentTabConfig.refetch}
                            currentPage={currentPage}
                            limit={limit}
                            activeTab={activeTab}
                        />
                    </div>
                    <div className='query-info-container'>
                        <p className='query-info'>
                            Queried {activeTab} - showing
                            <select name="numResults" id="num-results" value={limit} onChange={handleSelect}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select> 
                            per page.
                            <button onClick={goLeft}>{'<'}</button>
                            {currentPage+1}
                            <button onClick={goRight}>{'>'}</button>
                            of {maxPage}.
                        </p>
                    </div>
                </div>                
            </div>
            <OrderForm onOrderCreated={() => fetchOrders({onComplete: setOrders})} rackets={rackets} strings={strings} brands={brands} users={users}/>
            <RacketForm onRacketCreated={() => fetchRackets({onComplete: setRackets})} brands={brands}/>
            <StringForm onStringCreated={() => fetchStrings({onComplete: setStrings})} brands={brands}/>
            <UserForm onUserCreated={() => fetchUsers({onComplete: setUsers})} />   
            <BrandForm onBrandCreated={() => fetchBrands({onComplete: setBrands})}/>
        </div>
    )
}


export const TabContent = ({ data, renderItem, onDataDeleted, currentPage, limit, activeTab}) => {
    const startIndex = currentPage * limit;
    const endIndex = Math.min(data.length, startIndex + limit);
    const visibleData = data.slice(startIndex, endIndex);

    const handleDelete = async (item) => {
        try {
            await axios.delete(`http://localhost:5000/delete-${activeTab}/${item.id}`);
            onDataDeleted(); 
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="tab-content">
            {visibleData.length === 0 ? (
                <p>No data found.</p>
            ) : (
                <ul className="data-list">
                {visibleData.map((item) => (
                    <li key={item.id} className="data-item">
                        <div className="item-content">
                            {renderItem(item, () => handleDelete(item))}
                        </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
};

const FilterSearch =  () => {
    return (
        <div className='filter-container'>
            <div className='filter-header'>
                Filters
            </div>
        </div>
    )
}