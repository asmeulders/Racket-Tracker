import { useState } from 'react';

import { BrandSelect } from '../../brand/';
import { useRacket } from '../useRacket';

export const RacketForm = ({ onRacketCreated, brands }) => {
    const { createRacket } = useRacket();
    const [fields, setFields] = useState({
        name: '',
        price: '',
        brandId: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createRacket({ 
            name: fields.name,
            price: fields.price, 
            brandId: fields.brandId
        });
        
        setFields({
            name: '',
            price: '',
            brandId: ''
        })
        onRacketCreated();
    }

    return(
        <div>
            <h2>Create a racket</h2>
            <form onSubmit={handleSubmit}>
                <BrandSelect value={fields.brandId} brands={brands} onBrandChange={setFields} />

                <label htmlFor="name">Racket Name:</label>
                <input type="text" id="name" value={fields.name} onChange={(e) => setFields(prev => ({ ...prev, name: e.target.value}))} /><br />

                <label htmlFor="price">Price:</label>
                <input type="number" id="price" value={fields.price} onChange={(e) => setFields(prev => ({ ...prev, price: e.target.value}))} /><br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}