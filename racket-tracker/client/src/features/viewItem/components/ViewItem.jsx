import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { BrandView, InquiryView, OrderView, RacketView, StringView, UserView, NotFoundView } from '../index';
import { useViewItem } from '../useViewItem';

export const ViewItem = () => {
    const { type, id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { getItem } = useViewItem();

    useEffect(() => {
        setLoading(true);
        getItem(type, id)
        .then((data) => setData(data))
        .finally(() => setLoading(false));
    }, [type, id]);

    if (loading) return 'Loading...';

    const views = {
        orders: OrderView,
        brands: BrandView,
        users: UserView,
        rackets: RacketView,
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