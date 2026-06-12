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
import { fetchData, searchTable, initDatabases } from '../../../utils/db_utils.js';
import { NewItem } from './NewItem.jsx';
import './StoreDashboard.css';

export function StoreDashboard() {
    const [data, setData] = useState({
        orders: [],
        users: [],
        rackets: [],
        strings: [],
        brands: [],
        inquiries: []
    });   
    const [filters, setFilters] = useState({})
    const tabs = ['orders', 'rackets', 'strings', 'users', 'brands', 'inquiries'];
    const [visibleItems, setVisibleItems] = useState([]);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const[pageData, setPageData] = useState({
        'currentPage': 1,
        'perPage': 25,
        'hasNext': false
    })

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchDashboardData = async () => {
        const newData = {};
        for (let i = 0; i < tabs.length; i++) {
            newData[tabs[i]] = await fetchData({ table: tabs[i] });
        }
        setData(prev => ({ ...prev, ...newData }));
    }

    const tabConfig = {
        orders: {
            renderItem: (item) => <Order order={item} />,
            renderFilter: (onFilterChange) => <OrderFilter onFilterChange={onFilterChange} />,
            renderModal: () => <OrderForm onOrderCreated={handleCreateItem} handleClose={handleClose} rackets={data.rackets} strings={data.strings} users={data.users} />
        },
        rackets: {
            renderItem: (item) => <Racket racket={item} />,
            renderFilter: (onFilterChange) => <RacketFilter onFilterChange={onFilterChange} />,
            renderModal: () => <RacketForm onRacketCreated={handleCreateItem} handleClose={handleClose} brands={data.brands} />
        },
        strings: {
            renderItem: (item) => <String string={item} />,
            renderFilter: (onFilterChange) => <StringFilter onFilterChange={onFilterChange} />,
            renderModal: () => <StringForm onStringCreated={handleCreateItem} handleClose={handleClose} brands={data.brands} />
        },
        users: {
            renderItem: (item) => <User user={item} />,
            renderFilter: (onFilterChange) => <UserFilter onFilterChange={onFilterChange} />,
            renderModal: () => <UserForm onUserCreated={handleCreateItem} handleClose={handleClose} />
        },
        brands: {
            renderItem: (item) => <Brand brand={item} />,
            renderFilter: (onFilterChange) => <BrandFilter onFilterChange={onFilterChange} />,
            renderModal: () => <BrandForm onBrandCreated={handleCreateItem} handleClose={handleClose} />
        },
        inquiries: {
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
        paginate(data[selectedTab], pageData.currentPage, pageData.perPage);
    }

    const handleCreateItem = async () => {
        const freshData = await fetchData({ table: activeTab });
        setData(prev => ({...prev, [activeTab]: freshData}));
        paginate(freshData, pageData.currentPage, pageData.perPage);
        handleClose();
    }

    const handleDelete = (targetId) => {
        setVisibleItems(visibleItems.filter(item => item.id !== targetId));
        setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== targetId)
        }));
    }

    const paginate = (items, currentPage, perPage) => {
        const start = (currentPage - 1) * perPage;
        setVisibleItems(items.slice(start, start + perPage));
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
        paginate(data[activeTab], pageData.currentPage, pageData.perPage);
    }, []);

    const currentTabConfig = tabConfig[activeTab] || tabConfig.order;
    const totalPages = Math.ceil(data[activeTab].length / pageData.perPage);

    return (
        <div className='dashboard-container'>
            <div className='filter-header'>
                Filters
            </div>
            <div className='tab-header'>
                <button 
                    className={getTabClass(tabs[0])} 
                    onClick={() => handleClick(tabs[0])}
                >
                    Orders
                </button>
                <button 
                    className={getTabClass(tabs[1])} 
                    onClick={() => handleClick(tabs[1])}
                >
                    Rackets
                </button>
                <button 
                    className={getTabClass(tabs[2])} 
                    onClick={() => handleClick(tabs[2])}
                >
                    Strings
                </button>
                <button 
                    className={getTabClass(tabs[3])} 
                    onClick={() => handleClick(tabs[3])}
                >
                    Users
                </button>
                <button 
                    className={getTabClass(tabs[4])} 
                    onClick={() => handleClick(tabs[4])}
                >
                    Brands
                </button>
                <button 
                    className={getTabClass(tabs[5])} 
                    onClick={() => handleClick(tabs[5])}
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
                    items={visibleItems}
                    renderItem={currentTabConfig.renderItem}
                    onDataDeleted={handleDelete}
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