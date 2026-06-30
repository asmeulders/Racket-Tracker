import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { NewOrder } from './index';

export const NewItem = () => {
    const { type } = useParams();

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
        <Component />
    );
}