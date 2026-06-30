import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { NewOrder } from './index';

export const NewItem = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const handleNewItem = (id) => {
        navigate(`/store/view-item/${type}/${id}`);
    }

    const page = {
        orders: NewOrder,
        // brands: BrandView,
        // users: UserView,
        // rackets: RacketView,
        // inquiries: InquiryView,
        // strings: StringView
    };
    const Component = page[type] ?? <p>Unknown type</p>;

    return (
        <div className='new-item-page'>
            <Component onNewItem={handleNewItem}/>
        </div>
    );
}