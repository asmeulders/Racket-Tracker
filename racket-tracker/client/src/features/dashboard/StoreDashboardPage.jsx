import { StoreDashboard } from './components/StoreDashboard';
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
            
        </div>
        
    )
}