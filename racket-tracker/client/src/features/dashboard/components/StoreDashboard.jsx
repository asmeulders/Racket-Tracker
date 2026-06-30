import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { Order, OrderForm } from '../../order';
import { UserForm } from '../../user';
import { Inquiry } from '../../inquiry';
import { useStore } from '../../store/useStore';
import './StoreDashboard.css';

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
        <div className='dashboard-page'>
            <div className='dashboard-header'>
                <h1>Dashboard</h1>
                <p>{todayFormated}</p>
            </div>
            
            <div className='dashboard-content'>
                <div className='active-orders'>
                    {data?.orders.length === 0 ? (
                        <p>No active orders.</p>
                    ) : (
                        <ul className="item-list">
                            {data?.orders.map((item) => (
                                <li key={item.id} className="item-container" onClick={() => handleView('orders', item)}>
                                    <Order order={item}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='recent-inquiries'>
                    {data?.inquiries.length === 0 ? (
                        <p>No recent inquiries.</p>
                    ) : (
                        <ul className="item-list">
                            {data?.inquiries.map((item) => (
                                <li key={item.id} className="item-container" onClick={() => handleView('inquiries', item)}>
                                    <Inquiry inquiry={item}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>

            <div className='dashboard-quick-links'>
                <button type='button'>New Order</button>
                <button type='button'>New Customer</button>
            </div>
        </div>  
    )
}