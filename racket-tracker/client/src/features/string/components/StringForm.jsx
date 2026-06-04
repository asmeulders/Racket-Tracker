import { useState } from 'react';

import { BrandSelect } from '../../brand';
import { useString } from '../index';

export const StringForm = ({ onStringCreated, brands }) => {
    const { createString } = useString(); // TODO: use nmbers for defaults and not all empty strings??
    const [fields, setFields] = useState({
        name: '',
        pricePerRacket: '',
        brandId: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createRacket({ 
            name: fields.name,
            pricePerRacket: fields.pricePerRacket, 
            brandId: fields.brandId
        });
        
        setFields({
            name: '',
            pricePerRacket: '',
            brandId: ''
        })
        onStringCreated();
    }

    return(
        <div>
            <h2>Create a string</h2>
            <form onSubmit={handleSubmit}>
                <BrandSelect value={fields.brandId} brands={brands} onBrandChange={setFields} />

                <label htmlFor="name">String Name:</label>
                <input type="text" id="name" value={fields.name} onChange={(e) => setFields(prev => ({ ...prev, name: e.target.value}))} /><br />

                <label htmlFor="price">Price per racket:</label>
                <input type="number" id="price" value={fields.pricePerRacket} onChange={(e) => setFields(prev => ({ ...prev, pricePerRacket: e.target.value}))} /><br />

                
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}