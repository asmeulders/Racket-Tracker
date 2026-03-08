import { useState, useEffect } from 'react';
import { RacketForm } from './Racket';
import { fetchBrands, fetchRackets } from '../../common/db_utils';

export function RacketPage() {
    const [rackets, setRackets] = useState([])
    const [brands, setBrands] = useState([])

    const fetchAllData = async () => {
        try {
            fetchRackets({onComplete: setRackets});
            fetchBrands({onComplete: setBrands});
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <div>
            {/* <RacketList rackets={rackets} onRacketDeleted={() => fetchRackets({onComplete: setRackets})} /> */}
            <RacketForm onRacketCreated={() => fetchRackets({onComplete: setRackets})} brands={brands}/>
        </div>
    );
};