import { useState } from 'react';

import { BrandSelect } from '../../brand/components/Brand';
import { useRackets } from '../useRackets';

export const RacketForm = ({ onRacketCreated, brands }) => {
    const { createRacket } = useRackets();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [brandId, setBrandId] = useState('');

    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setStatus(null);
        await createRacket({ name, price, brandId });
        
        setName('');
        setPrice('');
        setBrandId('');
        onRacketCreated();
    }

    return(
        <div>
            <h2>Create a racket</h2>
            {error && <div>{error}</div>}
            {status && <div>{status}</div>}
            <form onSubmit={handleSubmit}>
                <BrandSelect value={brandId} brands={brands} onBrandChange={setBrandId} />

                <label htmlFor="name">Racket Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

                <label htmlFor="price">Price:</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} /><br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}