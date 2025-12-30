import { useState, useEffect } from 'react'
import axios from 'axios'

import { Brand, BrandList, BrandForm } from '../../components/brand/Brand'

export function BrandPage() {
    const [brands, setBrands] = useState([]);

    const fetchBrands = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/brands');
        setBrands(response.data);
        } catch (error) {
        console.error("Error fetching brands:", error);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);
    return(
        <div>
            <BrandList brands={brands} />
            <BrandForm onBrandCreated={fetchBrands} />
        </div> 
    )
}