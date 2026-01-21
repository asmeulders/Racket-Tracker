import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './StoreDashboard.css';

import { Racket, RacketForm, RacketFilter } from '../racket/Racket.jsx'
import { Order, OrderForm, OrderFilter } from '../order/Order.jsx'
import { String, StringForm, StringFilter } from '../string/String.jsx'
import { User, UserForm, UserFilter } from '../user/User.jsx'
import { Brand, BrandForm, BrandFilter } from '../brand/Brand.jsx'
import { Inquiry, InquiryFilter } from '../inquiry/Inquiry.jsx';
import Dropdown from './Dropdown.jsx';
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers, searchTable } from '../../common/db_utils.js';

export function StoreDashboard() {
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([]);
    const [rackets, setRackets] = useState([]);
    const [strings, setStrings] = useState([]);
    const [brands, setBrands] = useState([]);    
    const [filters, setFilters] = useState({})
    
    const [activeTab, setActiveTab] = useState('order');
    const[pageData, setPageData] = useState({
        'currentPage': 1,
        'perPage': 25,
        'totalPages': 1,
        'items': [],
        'hasNext': false
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
            searchTable({ 
                table: activeTab, 
                page: pageData.currentPage, 
                perPage: pageData.perPage, 
                filters: filters,
                onComplete: setPageData
            })
        } catch (error) {
            console.error("Error connecting to server:" ,error)
        }
    }

    const tabConfig = {
        order: {
            renderItem: (item, handleDelete) => <Order order={item} onDelete={(item) => handleDelete(item)} />,
            renderFilter: (onFilterChange) => <OrderFilter onFilterChange={onFilterChange} />
        },
        racket: {
            renderItem: (item, handleDelete) => <Racket racket={item} onDelete={(item) => handleDelete(item)} />,
            renderFilter: (onFilterChange) => <RacketFilter onFilterChange={onFilterChange} />
        },
        string: {
            renderItem: (item, handleDelete) => <String string={item} onDelete={(item) => handleDelete(item)} />,
            renderFilter: (onFilterChange) => <StringFilter onFilterChange={onFilterChange} />
        },
        user: {
            renderItem: (item, handleDelete) => <User user={item} onDelete={(item) => handleDelete(item)} />,
            renderFilter: (onFilterChange) => <UserFilter onFilterChange={onFilterChange} />
        },
        brand: {
            renderItem: (item, handleDelete) => <Brand brand={item} onDelete={(item) => handleDelete(item)} />,
            renderFilter: (onFilterChange) => <BrandFilter onFilterChange={onFilterChange} />
        },
        inquiry: {
            renderItem: (item, handleDelete) => <Inquiry inquiry={item} onDelete={(item) => handleDelete(item)} />,
            renderFilter: (onFilterChange) => <InquiryFilter onFilterChange={onFilterChange} />
        }
    };

    const getTabClass = (tabName) => {
        return `tab-button ${activeTab === tabName ? 'active' : ''}`;
    };

    const handleSelect = (event) => {
        setPageData(prev => ({
            ...prev,
            'perPage': Number(event.target.value)
        }));
    };

    const handleClick = (selectedTab) => {
        setActiveTab(selectedTab);
        setFilters({});
        searchTable({ table: selectedTab, page: 1, perPage: pageData.perPage, onComplete: setPageData })
    }

    const goLeft = () => {
        setPageData(prev => ({
            ...prev,
            'currentPage': Math.max(prev.currentPage-1, 1)
        }));
    };

    const goRight = () => {
        setPageData(prev => ({
            ...prev,
            'currentPage': Math.min(prev.totalPages, prev.currentPage + 1)
        }));
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [pageData.currentPage, pageData.perPage, filters, activeTab]);

    const currentTabConfig = tabConfig[activeTab] || tabConfig.order;

    return (
        <div className='store-dashboard-page'>
            <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
                Initialize & Seed Databases
            </button>
            <div className='dashboard-container'>
                <div className='filter-header'>
                    Filters
                </div>
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
                    <button 
                        className={getTabClass('inquiry')} 
                        onClick={() => handleClick('inquiry')}
                    >
                        Inquiries
                    </button>
                </div>
                <div className='filter-content'>
                    <FilterSearch renderFilter={currentTabConfig.renderFilter} onFilterChange={setFilters} />
                </div>
                <div className='content-box'>
                    <TabContent
                        items={pageData.items}
                        renderItem={currentTabConfig.renderItem}
                        onDataDeleted={() => searchTable({ table: activeTab, page: pageData.currentPage, perPage: pageData.perPage, onComplete: setPageData })}
                        activeTab={activeTab}
                    />
                    <div className='query-info-container'>
                        <p className='query-info'>
                            Queried {activeTab} - showing
                            <select name="numResults" id="num-results" value={pageData.perPage} onChange={handleSelect}>
                                {/* <option value="1">1</option> */}
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select> 
                            per page.
                            <button className='arrow-btn' onClick={goLeft}>&laquo;</button>
                            {pageData.currentPage}
                            <button className='arrow-btn' onClick={goRight}>&raquo;</button>
                            of {pageData.totalPages !== 0 ? pageData.totalPages : 1}.
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
    // const handleDelete = async (item) => {
    //     const confirmed = window.confirm("Are you sure you want to delete this item?");
  
    //     if (confirmed) {
    //         try {
    //             await axios.delete(`http://localhost:5000/delete-${activeTab}/${item.id}`);
    //             onDataDeleted(); 
    //         } catch (error) {
    //             console.error("Error deleting item:", error);
    //         }
    //         console.log("Item deleted!");
    //     } else {
    //         console.log("Action cancelled.");
    //     }
    // };

    return (
        <div className="tab-content">
            {items.length === 0 ? (
                <p>No data found.</p>
            ) : (
                <ul className="data-list">
                    {items.map((item) => (
                        <li key={item.id} className="data-item">
                            <div className="item-content">
                                {renderItem(item, onDataDeleted)}
                            </div>                        
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const FilterSearch =  ({ renderFilter, onFilterChange }) => {

    return (
        <div className='filter-container'>
            <form>
                {renderFilter(onFilterChange)}
            </form>
        </div>
    )
}