import { useState, useEffect } from 'react';
import { StringList, StringForm } from '../../components/string/string';
import { fetchBrands, fetchStrings } from '../../common/db_utils';

export function StringPage() {
    const [strings, setStrings] = useState([])
    const [brands, setBrands] = useState([])

    const fetchAllData = async () => {
            try {
                fetchStrings({onComplete: setStrings});
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
            <StringList strings={strings} onStringDeleted={() => fetchStrings({onComplete: setStrings})} />
            <StringForm onStringCreated={() => fetchStrings({onComplete: setStrings})} brands={brands}/>
        </div>
    );
};