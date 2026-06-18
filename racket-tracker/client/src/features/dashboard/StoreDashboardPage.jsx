import { StoreDashboard } from './components/StoreDashboard';
import { OrderForm } from '../order';
import { RacketForm } from '../racket';
import { StringForm } from '../string';
import { UserForm } from '../user';
import { BrandForm } from '../brand';
import { useDatabase } from '../../utils/useDatabase';

export function StoreDashboardPage(){
    const { initDatabase } = useDatabase();
    const handleInit = async () => {
        await initDatabase();
    }

    return (
        <div className='store-dashboard-page'>
            <button onClick={handleInit} style={{ marginBottom: "20px" }}>
                Initialize & Seed Databases
            </button>
            <StoreDashboard />
            {/* <OrderForm onOrderCreated={() => {
                fetchOrders({onComplete: setOrders});
                if (activeTab == "order") { fetchDashboardData(); }
            }} rackets={rackets} strings={strings} brands={brands} users={users}/>
            <RacketForm onRacketCreated={() => {
                fetchRackets({onComplete: setRackets});
                if (activeTab == "racket") { fetchDashboardData(); }
            }} brands={brands}/>
            <StringForm onStringCreated={() => {
                fetchStrings({onComplete: setStrings});
                if (activeTab == "string") { fetchDashboardData(); }
            }} brands={brands}/>
            <UserForm onUserCreated={() => {
                fetchUsers({onComplete: setUsers}); 
                if (activeTab == "user") { fetchDashboardData(); }
            }} />   
            <BrandForm onBrandCreated={() => {
                fetchBrands({onComplete: setBrands});
                if (activeTab == "brand") { fetchDashboardData(); }
            }}/> */}
        </div>
        
    )
}