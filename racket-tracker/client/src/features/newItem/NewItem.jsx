import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { NewOrder, NewRacket, NewString, NewBrand, NewUser } from './index';

export const NewItem = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const handleNewItem = (id) => {
        console.log(`/store/view-item/${type}/${id}`);
        navigate(`/store/view-item/${type}/${id}`);
    }

    const page = {
        orders: NewOrder,
        brands: NewBrand,
        users: NewUser,
        rackets: NewRacket,
        strings: NewString,
    };
    const Component = page[type] ?? <p>Unknown type</p>;

    return (
        <div className='new-item-page'>
            <Component onNewItem={handleNewItem}/>
        </div>
    );
}