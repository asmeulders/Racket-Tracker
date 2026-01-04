import { useState, useEffect } from 'react';
import { BrandForm } from '../../components/brand/Brand';
import { fetchBrands } from '../../common/db_utils';

export function BrandPage() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchBrands({onComplete: setBrands});
    }, []);

    return(
        <div>
            {/* <BrandList brands={brands} onBrandDeleted={() => fetchBrands({onComplete: setBrands})}/> */}
            <BrandForm onBrandCreated={() => fetchBrands({onComplete: setBrands})} />
        </div> 
    )
}