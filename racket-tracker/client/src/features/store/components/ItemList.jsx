import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

import { useViewItem } from "../../viewItem/useViewItem";
import { useStore } from "../useStore";

import { Racket, RacketFilter, RacketForm } from "../../racket";
import { Order, OrderFilter, OrderForm } from "../../order";
import { String, StringFilter, StringForm } from "../../string";
import { User, UserFilter, UserForm } from "../../user";
import { Brand, BrandFilter, BrandForm } from "../../brand";
import { Inquiry, InquiryFilter } from "../../inquiry";
import { Collapsible } from "../../../components/collapsible/Collapsible";

// TODO: 
// order date range filter
// add times to order
// other racket table for specific model specs

export const ItemList = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const { getPage, deleteItem } = useStore();
    const { getList } = useViewItem();

    const isFirstRender = useRef(true);

    const [ data, setData ] = useState(null);
    const [ filters, setFilters ] = useState({});
    const [ show, setShow ] = useState(false);
    const [ modalData, setModalData ] = useState(null);

    useEffect(() => {
        getPage(type, page, limit, filters)
            .then(data => setData(data));
    }, [type, page, limit, filters]);

    if (!data) return <p>Loading...</p>;

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        setShow(true);
        for (let i = 0; i < modalConfig[type].length; i++) {
            const items = await getList(modalConfig[type][i]);
            setModalData(prev => ({...prev, [modalConfig[type][i]]: items}));
        }
    }

    const handleCreateItem = (type, close) => {
        getPage(type, page, limit, filters)
            .then(data => setData(data));
        if (close) {
            handleClose();
        }
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        if (confirmed) {
            await deleteItem(type, item.id);
            // onDataDeleted(item.id);
        }
    };

    const handleView = async (item) => {
        const url = `/store/view-item/${type}/${item.id}`;
        await navigate(url);
    };

    const handleSelect = (event) => {
        setSearchParams({ page, limit: Number(event.target.value) });
    };    
    
    const itemConfig = {
        orders: {
            renderItem: (item) => <Order order={item} />,
            renderFilter: (onFilterChange) => <OrderFilter onFilterChange={onFilterChange} />,
            renderModal: () => <OrderForm onDataCreated={handleCreateItem} handleClose={handleClose} rackets={modalData?.rackets} strings={modalData?.strings} users={modalData?.users} />
        },
        rackets: {
            renderItem: (item) => <Racket racket={item} />,
            renderFilter: (onFilterChange) => <RacketFilter onFilterChange={onFilterChange} />,
            renderModal: () => <RacketForm onDataCreated={handleCreateItem} handleClose={handleClose} brands={modalData?.brands} />
        },
        strings: {
            renderItem: (item) => <String string={item} />,
            renderFilter: (onFilterChange) => <StringFilter onFilterChange={onFilterChange} />,
            renderModal: () => <StringForm onDataCreated={handleCreateItem} handleClose={handleClose} brands={modalData?.brands} />
        },
        users: {
            renderItem: (item) => <User user={item} />,
            renderFilter: (onFilterChange) => <UserFilter onFilterChange={onFilterChange} />,
            renderModal: () => <UserForm onDataCreated={handleCreateItem} handleClose={handleClose} />
        },
        brands: {
            renderItem: (item) => <Brand brand={item} />,
            renderFilter: (onFilterChange) => <BrandFilter onFilterChange={onFilterChange} />,
            renderModal: () => <BrandForm onDataCreated={handleCreateItem} handleClose={handleClose} />
        },
        inquiries: {
            renderItem: (item) => <Inquiry inquiry={item} />,
            renderFilter: (onFilterChange) => <InquiryFilter onFilterChange={onFilterChange} />,
            renderModal: () => <></>
        }
    };
    
    const modalConfig = {
        orders: ['rackets', 'strings', 'users'],
        rackets: ['brands'],
        strings: ['brands'],
        users: [],
        brands: [],
        inquiries: []
    }

    return (
        <>
            <div className="list-header">
                <h1>{type}</h1>
                <button className="new-item-btn" type="button" onClick={handleShow}>New {type}</button>
            </div>
            <div className="filter-container">
                <Collapsible renderContent={() => itemConfig[type].renderFilter(setFilters)}/>
            </div>
            <div className="list-content">
                {data.items.length === 0 ? (
                    <p>No data found.</p>
                ) : (
                    <ul className="item-list">
                        {data.items.map((item) => (
                            <li key={item.id} className="item-container">
                                <div className="item-content">
                                    {itemConfig[type].renderItem(item)}
                                </div>
                                <div className='item-actions-btn'>
                                    <button type='button' onClick={() => handleDelete(item)}>Delete</button>
                                    <button type='button' onClick={() => handleView(item)}>View</button>      
                                </div>          
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='query-info-container'>
                <p className='query-info'>
                    Queried {type} - showing
                    <select name="numResults" id="num-results" value={limit} onChange={handleSelect}>
                        {/* <option value="1">1</option> */}
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select> 
                    per page.
                    <button className='arrow-btn' disabled={!data.hasPrev} onClick={() => setSearchParams({ page: page - 1, limit })}>&laquo;</button>
                    {page}
                    <button className='arrow-btn' disabled={!data.hasNext} onClick={() => setSearchParams({ page: page + 1, limit })}>&raquo;</button>
                    of {data.totalPages !== 0 ? data.totalPages : 1}.
                </p>
            </div>
            <Modal show={show} onHide={handleClose}>
                {itemConfig[type].renderModal()}
            </Modal>
        </>        
    )
}