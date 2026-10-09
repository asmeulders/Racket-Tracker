import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { Order, OrderForm } from '../../order';
import { UserForm } from '../../user';
import { Inquiry } from '../../inquiry';
import { useStore } from '../../store/useStore';
import './StoreDashboard.css';
import { StorePageLayout } from '../../store';

export function StoreDashboard() {
    const { getPage } = useStore();
    const navigate = useNavigate();

    const [data, setData] = useState(null);   

    const fetchDashboardData = async () => {
        const orderFilters = {
            'completed': 'uncompleted'
        }
        const orders = await getPage('orders', 1, 3, orderFilters);
        const inquiryFilters = {
            'inqDateAfter': lastWeekDate
        }
        const inquiries = await getPage('inquiries', 1, 2, inquiryFilters);
        setData(prev => ({ ...prev, orders: orders.items, inquiries: inquiries.items }));
    }

    const handleView = async (type, item) => {
        const url = `/store/view-item/${type}/${item.id}`;
        await navigate(url);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const todayDate = new Date();
    const todayFormated = format(new Date(), 'MM/dd/yyyy');
    const lastWeekDate = new Date(todayDate.getTime() - 7*24*60*60*1000);

    return (
        <StorePageLayout
            title={"Dashboard"}
            actions={
                <>
                    <button type='button' onClick={() => navigate('/store/new-item/orders')}>New Order</button>
                    <button type='button' onClick={() => navigate('/store/new-item/users')}>New Customer</button>
                </>
            }
        >
            <DashboardSection
                title={"Upcoming Orders"}
                items={data?.orders}
                Card={Order}
                onClick={(item) => handleView('orders', item)}
                fallback={"No outstanding orders"}
            />

            <DashboardSection
                title={"Recent Inquiries"}
                items={data?.inquiries}
                Card={Inquiry}
                onClick={() => handleView('inquiries', item)}
                fallback={"No recent inquiries"}
            />
        </StorePageLayout>
    )
}

const DashboardSection = ({title, items, Card, onClick, fallback}) => {
    return (
        <div className='dashboard-section'>
            {items?.length === 0 ? (
                <p>{fallback}</p>
            ) : (
                <ul className="item-list">
                    {items?.map((item) => (
                        <li key={item.id} className="item-container" onClick={() => onClick(item)}> 
                            <Card item={item}/>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}