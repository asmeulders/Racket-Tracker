import { useState } from 'react';

import { BrandSelect } from '../../brand';
import { useString } from '../index';

export const StringForm = ({ onStringCreated, brands }) => {
    const { createString } = useString();
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [pricePerRacket, setPricePerRacket] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createString({ name, pricePerRacket, brandId });
        
        setName('');
        setPricePerRacket('');
        setBrandId('');
        onStringCreated();
    }

    return(
        <div>
            <h2>Create a string</h2>
            <form onSubmit={handleSubmit}>
                <BrandSelect value={brandId} brands={brands} onBrandChange={setBrandId} />

                <label htmlFor="name">String Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

                <label htmlFor="price">Price per racket:</label>
                <input type="number" id="price" value={pricePerRacket} onChange={(e) => setPricePerRacket(e.target.value)} /><br />

                
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}