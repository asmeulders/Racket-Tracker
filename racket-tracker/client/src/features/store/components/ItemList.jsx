import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useOrder } from '../../order';
import { useRacket } from '../../racket';
import { useString } from '../../string';
import { useUser } from '../../user';
import { useBrand } from '../../brand';
import { useInquiry } from '../../inquiry';
import { useViewItem } from "../../viewItem/useViewItem";
import { useStore } from "../useStore";

import { Racket } from "../../racket";
import { Order } from "../../order";
import { String } from "../../string";
import { User } from "../../user";
import { Brand } from "../../brand";
import { Inquiry } from "../../inquiry";

export const ItemList = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const { deleteOrder } = useOrder();
    const { deleteRacket } = useRacket();
    const { deleteString } = useString();
    const { deleteUser } = useUser();
    const { deleteBrand } = useBrand();
    const { deleteInquiry } = useInquiry();
    const { getList } = useViewItem();
    const { deleteItem } = useStore();

    const [ items, setItems ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        setLoading(true);
        getList(type)
            .then(data => {
                setItems(data);
                console.log("data: ", data);
            })
            .finally(() => setLoading(false));
    }, [type]);

    if (loading) return 'Loading...';

    const handleDelete = async (item) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        if (confirmed) {
            await deleteItem(type, item.id);
            // onDataDeleted(item.id);
        }
    };

    const handleEdit = async (item) => {
        const url = `/store/view-item/${type}/${item.id}`;
        await navigate(url);
    };
    
    const itemConfig = {
        'orders': (item) => <Order order={item} />,
        'rackets': (item) => <Racket racket={item} />,
        'strings': (item) => <String string={item} />,
        'users': (item) => <User user={item} />,
        'brands': (item) => <Brand brand={item} />,
        'inquiries': (item) => <Inquiry inquiry={item} />,
    }

    return (
        <div className="list-content">
            {items.length === 0 ? (
                <p>No data found.</p>
            ) : (
                <ul className="item-list">
                    {items.map((item) => (
                        <li key={item.id} className="item">
                            <div className="item-content">
                                {itemConfig[type](item)}
                            </div>
                            <div className='item-actions-btn'>
                                <button type='button' onClick={() => handleDelete(item)}>Delete</button>
                                <button type='button' onClick={() => handleEdit(item)}>Edit</button>      
                            </div>          
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}