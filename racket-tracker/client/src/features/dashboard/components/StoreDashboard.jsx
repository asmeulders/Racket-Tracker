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
        brands: []
    });   
    const [filters, setFilters] = useState({})
    const tabs = ['order', 'racket', 'string', 'user', 'brand', 'inquiry'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
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

    const handleCreateItem = async () => {
        handleClose();
        await fetchDashboardData();
    }

    const fetchDashboardData = async () => {
        for (let i = 0; i < tabs.length; i++) {
            const fetchedData = await fetchData({ table: tabs[i] });
            setData(prev => ({...prev, [tabs[i]]: fetchedData }));
        }
        console.log(data);

        // try {
        //     await searchTable({ 
        //         table: activeTab, 
        //         page: pageData.currentPage, 
        //         perPage: pageData.perPage, 
        //         filters: filters,
        //         onComplete: setPageData
        //     })
        // } catch (error) {
        //     console.error("Error connecting to server:", error)
        // }
    }

    const tabConfig = {
        order: {
            renderItem: (item) => <Order order={item} />,
            renderFilter: (onFilterChange) => <OrderFilter onFilterChange={onFilterChange} />,
            renderModal: () => <OrderForm onOrderCreated={handleCreateItem} handleClose={handleClose} rackets={data.rackets} strings={data.strings} users={data.users} />
        },
        racket: {
            renderItem: (item) => <Racket racket={item} />,
            renderFilter: (onFilterChange) => <RacketFilter onFilterChange={onFilterChange} />,
            renderModal: () => <RacketForm onRacketCreated={handleCreateItem} handleClose={handleClose} brands={data.brands} />
        },
        string: {
            renderItem: (item) => <String string={item} />,
            renderFilter: (onFilterChange) => <StringFilter onFilterChange={onFilterChange} />,
            renderModal: () => <StringForm onStringCreated={handleCreateItem} handleClose={handleClose} brands={data.brands} />
        },
        user: {
            renderItem: (item) => <User user={item} />,
            renderFilter: (onFilterChange) => <UserFilter onFilterChange={onFilterChange} />,
            renderModal: () => <UserForm onUserCreated={handleCreateItem} handleClose={handleClose} />
        },
        brand: {
            renderItem: (item) => <Brand brand={item} />,
            renderFilter: (onFilterChange) => <BrandFilter onFilterChange={onFilterChange} />,
            renderModal: () => <BrandForm onBrandCreated={handleCreateItem} handleClose={handleClose} />
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
    }, []);

    // useEffect(() => { // this will cause me to send more than needed on start up
    //     fetchDashboardData();
    // }, [pageData.currentPage, pageData.perPage, filters, activeTab]);

    const currentTabConfig = tabConfig[activeTab] || tabConfig.order;

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