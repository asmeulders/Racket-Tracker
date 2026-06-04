import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { Racket, RacketFilter, RacketForm } from '../../racket';
import { Order, OrderFilter, OrderForm } from '../../order';
import { String, StringFilter, StringForm } from '../../string';
import { User, UserFilter, UserForm } from '../../user';
import { Brand, BrandFilter, BrandForm } from '../../brand';
import { Inquiry, InquiryFilter, InquiryForm } from '../../inquiry';
import { FilterSearch, TabContent } from '../index.js';
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers, searchTable, initDatabases } from '../../../utils/db_utils.js';
import { NewItem } from './NewItem.jsx';
import './StoreDashboard.css';

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

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const assertFormComplete = () => {

    }

    const handleCreateItem = async () => {
        handleClose();
        await fetchDashboardData();
    }

    const fetchDashboardData = async () => {
        try {
            await searchTable({ 
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
            renderItem: (item) => <Order order={item} />,
            renderFilter: (onFilterChange) => <OrderFilter onFilterChange={onFilterChange} />,
            renderModal: () => <OrderForm onOrderCreated={handleCreateItem} handleClose={handleClose} rackets={rackets} strings={strings} users={users} />
        },
        racket: {
            renderItem: (item) => <Racket racket={item} />,
            renderFilter: (onFilterChange) => <RacketFilter onFilterChange={onFilterChange} />,
            renderModal: () => <RacketForm onRacketCreated={handleCreateItem} brands={brands} />
        },
        string: {
            renderItem: (item) => <String string={item} />,
            renderFilter: (onFilterChange) => <StringFilter onFilterChange={onFilterChange} />,
            renderModal: () => <StringForm onStringCreated={handleCreateItem} brands={brands} />
        },
        user: {
            renderItem: (item) => <User user={item} />,
            renderFilter: (onFilterChange) => <UserFilter onFilterChange={onFilterChange} />,
            renderModal: () => <UserForm onUserCreated={handleCreateItem} />
        },
        brand: {
            renderItem: (item) => <Brand brand={item} />,
            renderFilter: (onFilterChange) => <BrandFilter onFilterChange={onFilterChange} />,
            renderModal: () => <BrandForm onBrandCreated={handleCreateItem} />
        },
        inquiry: {
            renderItem: (item) => <Inquiry inquiry={item} />,
            renderFilter: (onFilterChange) => <InquiryFilter onFilterChange={onFilterChange} />,
            renderModal: () => <></>
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
        // Get data for forms
        fetchRackets({onComplete: setRackets});
        fetchUsers({onComplete: setUsers});
        fetchStrings({onComplete: setStrings});
        fetchBrands({onComplete: setBrands});
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [pageData.currentPage, pageData.perPage, filters, activeTab]);

    const currentTabConfig = tabConfig[activeTab] || tabConfig.order;

    return (
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
                {/* TODO: make sure the buttons on the order thing works */}
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
            <NewItem className={"new-item-btn"} onClick={handleShow} /> 
            <Modal show={show} onHide={handleClose}>
                {currentTabConfig.renderModal()}
                
                </Modal>
        </div>  
    )
}