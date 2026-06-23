import { useState, useEffect } from 'react';

import './StoreDashboard.css';

export function StoreDashboard() {
    const [data, setData] = useState(null);   

    const fetchDashboardData = async () => {
        const newData = {};
        // implement
        setData(prev => ({ ...prev, ...newData }));
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className='dashboard-container'>
            #Dashboard
        </div>  
    )
}