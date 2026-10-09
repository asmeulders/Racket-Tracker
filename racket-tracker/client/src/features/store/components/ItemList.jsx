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

import './ItemList.css'
import { StorePageLayout } from "./StorePageLayout";

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

    const { getPage } = useStore();
    const { getList } = useViewItem();

    const isFirstRender = useRef(true);

    const [ data, setData ] = useState(null);
    const [ filters, setFilters ] = useState({});
    const [ show, setShow ] = useState(false);
    const [ modalData, setModalData ] = useState(null);

    useEffect(() => {
        let active = true;
        getPage(type, page, limit, filters).then(data => {
            if (active) setData(data);
        });
        return () => { active = false; };
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

    const handleView = async (item) => {
        const url = `/store/view-item/${type}/${item.id}`;
        await navigate(url);
    };
    
    const itemConfig = {
        orders: {
            renderItem: (item) => <Order item={item} />,
            renderFilter: (onFilterChange) => <OrderFilter onFilterChange={onFilterChange} />,
            renderModal: () => <OrderForm onDataCreated={handleCreateItem} handleClose={handleClose} rackets={modalData?.rackets} strings={modalData?.strings} users={modalData?.users} />
        },
        rackets: {
            renderItem: (item) => <Racket item={item} />,
            renderFilter: (onFilterChange) => <RacketFilter onFilterChange={onFilterChange} />,
            renderModal: () => <RacketForm onDataCreated={handleCreateItem} handleClose={handleClose} brands={modalData?.brands} />
        },
        strings: {
            renderItem: (item) => <String item={item} />,
            renderFilter: (onFilterChange) => <StringFilter onFilterChange={onFilterChange} />,
            renderModal: () => <StringForm onDataCreated={handleCreateItem} handleClose={handleClose} brands={modalData?.brands} />
        },
        users: {
            renderItem: (item) => <User item={item} />,
            renderFilter: (onFilterChange) => <UserFilter onFilterChange={onFilterChange} />,
            renderModal: () => <UserForm onDataCreated={handleCreateItem} handleClose={handleClose} />
        },
        brands: {
            renderItem: (item) => <Brand item={item} />,
            renderFilter: (onFilterChange) => <BrandFilter onFilterChange={onFilterChange} />,
            renderModal: () => <BrandForm onDataCreated={handleCreateItem} handleClose={handleClose} />
        },
        inquiries: {
            renderItem: (item) => <Inquiry item={item} />,
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

    const displayTitle = type.substring(0,1).toUpperCase() + type.substring(1);
    const displayName = displayTitle.substring(0, displayTitle.length-1)

    return (
        <StorePageLayout
            title={displayTitle}
            actions={
                type !== "inquiries" && 
                    <button className="new-item-btn" type="button" onClick={() => navigate(`/store/new-item/${type}`)}>New {displayName}</button>
            }
            footer={
                <QueryInfo 
                    page={page}
                    data={data}
                    limit={limit}
                    setSearchParams={setSearchParams}
                />
            }
        >
            <div className="filter-container">
                <Collapsible renderContent={() => itemConfig[type].renderFilter(setFilters)}/>
            </div>
            <div className="list-content">
                {data.items.length === 0 ? (
                    <p>No data found.</p>
                ) : (
                    <ul className="item-list">
                        {data.items.map((item) => (
                            <li key={item.id} className="item-container" onClick={() => handleView(item)}>
                                {itemConfig[type].renderItem(item)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <Modal show={show} onHide={handleClose}>
                {itemConfig[type].renderModal()}
            </Modal>
        </StorePageLayout>
    )
}

const QueryInfo = ({page, data, limit, setSearchParams}) => {

    const handleSelect = (event) => {
        setSearchParams({ page, limit: Number(event.target.value) });
    };    

    return (
        <div className='query-info-container'>
            <div className="query-info-text">
                <span>Show</span>
                <select name="numResults" id="num-results" value={limit} onChange={handleSelect}>
                    {/* <option value="1">1</option> */}
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select> 
                <span>per page.</span>

                <button disabled={!data.hasPrev} onClick={() => setSearchParams({ page: page - 1, limit })}>
                    <i class="fa-solid fa-arrow-left-long"></i>
                </button>
                <span>Page {page} of {data.totalPages !== 0 ? data.totalPages : 1}.</span>
                <button disabled={!data.hasNext} onClick={() => setSearchParams({ page: page + 1, limit })}>
                    <i class="fa-solid fa-arrow-right-long"></i>
                </button>
                
            </div>
        </div>
    )
}