import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { BrandView, InquiryView, OrderView, StringView, UserView, NotFoundView } from './index';
import { useOrder } from '../order/useOrder';

export const ViewItem = () => {
    const { type, id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { getOrder } = useOrder();

    const typeMap = {
        orders: 'order',
        brands: 'brand',
        strings: 'string',
        rackets: 'racket',
        inquiries: 'inquiry'
    }
    useEffect(() => {
        setLoading(true);
        getOrder(id)
        .then((data) => setData(data))
        .finally(() => setLoading(false));
    }, [type, id]);

    if (loading) return 'Loading...';

    const views = {
        orders: OrderView,
        brands: BrandView,
        users: UserView,
        inquiries: InquiryView,
        strings: StringView
    };
    const Component = views[type] ?? NotFoundView;

    return (
        <div className="view-item-page">
            <Component data={data} setData={setData}/>
        </div>
    );
}