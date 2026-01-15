import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './StoreDashboard.css';

import { Racket, RacketForm } from '../racket/Racket.jsx'
import { Order, OrderForm } from '../order/Order.jsx'
import { String, StringForm } from '../string/String.jsx'
import { User, UserForm } from '../user/User.jsx'
import { Brand, BrandForm } from '../brand/Brand.jsx'
import { Inquiry } from '../inquiry/Inquiry.jsx';
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers, searchTable } from '../../common/db_utils.js';

export function StoreDashboard() {
    const [users, setUsers] = useState([]);
    const [rackets, setRackets] = useState([]);
    const [orders, setOrders] = useState([]);
    const [strings, setStrings] = useState([]);
    const [brands, setBrands] = useState([]);
    const [inquiries, setInquiries] = useState([]);

    

    const [activeTab, setActiveTab] = useState('orders');
    const [limit, setLimit] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const[pageData, setPageData] = useState({
        'current_page': 1,
        'limit': 25,
        'total_pages': 1,
        'items': []
    })

    const initDatabases = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/init_db');
            alert("Databases Created & Seeded!");
            fetchDashboardData();
        } catch (error) {
            console.error("Error initializing DB:", error);
        }
    };

    const fetchDashboardData = async () => {
        try {
            searchTable({ table: activeTab, page: pageData.current_page, per_page: pageData.limit, onComplete: setPageData })
        } catch (error) {
            console.error("Error connecting to server:" ,error)
        }
    }

    const maxPage = Math.max(1, Math.ceil(pageData.items.length / limit));

    const tabConfig = {
        orders: {
            renderItem: (item, handleDelete) => <Order order={item} onDelete={(item) => handleDelete(item)} />,
        },
        rackets: {
            renderItem: (item, handleDelete) => <Racket racket={item} onDelete={(item) => handleDelete(item)} />,
        },
        strings: {
            renderItem: (item, handleDelete) => <String string={item} onDelete={(item) => handleDelete(item)} />,
        },
        users: {
            renderItem: (item, handleDelete) => <User user={item} onDelete={(item) => handleDelete(item)} />,
        },
        brands: {
            renderItem: (item, handleDelete) => <Brand brand={item} onDelete={(item) => handleDelete(item)} />,
        },
        inquiries: {
            renderItem: (item, handleDelete) => <Inquiry inquiry={item} onDelete={(item) => handleDelete(item)} />,
        }
    };

    const getTabClass = (tabName) => {
        return `tab-button ${activeTab === tabName ? 'active' : ''}`;
    };

    const handleSelect = (event) => {
        setLimit(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleClick = (selectedTab) => {
        setActiveTab(selectedTab);
        searchTable({ table: selectedTab, page: 1, per_page: pageData.limit, onComplete: setPageData })
    }

    const goLeft = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const goRight = () => {
        setCurrentPage(prev => Math.min(maxPage - 1, prev + 1));
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const currentTabConfig = tabConfig[activeTab] || tabConfig.orders;

    return (
        <div className='store-dashboard-page'>
            <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
                Initialize & Seed Databases
            </button>
            <div className='dashboard-container'>
                <div className='filter-title'>
                    <FilterSearch />
                </div>
                <div className='tab-header'>
                    <button 
                        className={getTabClass('orders')} 
                        onClick={() => handleClick('orders')}
                    >
                        Orders
                    </button>
                    <button 
                        className={getTabClass('rackets')} 
                        onClick={() => handleClick('rackets')}
                    >
                        Rackets
                    </button>
                    <button 
                        className={getTabClass('strings')} 
                        onClick={() => handleClick('strings')}
                    >
                        Strings
                    </button>
                    <button 
                        className={getTabClass('users')} 
                        onClick={() => handleClick('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={getTabClass('brands')} 
                        onClick={() => handleClick('brands')}
                    >
                        Brands
                    </button>
                    <button 
                        className={getTabClass('inquiries')} 
                        onClick={() => handleClick('inquiries')}
                    >
                        Inquiries
                    </button>
                </div>
                <div className='filter-content'>
                    <p>Fill in</p>
                </div>
                <div className='content-box'>
                    <TabContent
                        items={pageData.items}
                        renderItem={currentTabConfig.renderItem}
                        onDataDeleted={() => searchTable({ table: activeTab, page: currentPage, per_page: pageData.limit, onComplete: setPageData })}
                        activeTab={activeTab}
                    />
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
                            <button className='arrow-btn' onClick={goLeft}>{'<'}</button>
                            {currentPage}
                            <button className='arrow-btn' onClick={goRight}>{'>'}</button>
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


export const TabContent = ({ items, renderItem, onDataDeleted, activeTab}) => {

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
            {items.length === 0 ? (
                <p>No data found.</p>
            ) : (
                <ul className="data-list">
                {items.map((item) => (
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