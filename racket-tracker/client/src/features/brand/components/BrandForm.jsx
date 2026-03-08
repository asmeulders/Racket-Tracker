import { useState } from 'react';

import { useBrand } from '../useBrand';

export const BrandForm = ({ onBrandCreated }) => {
    const { createBrand } = useBrand()
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createBrand(name);

        setName('');
        onBrandCreated();
    }

    return(
        <div>
            <h2>Create a brand</h2>
            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Brand Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />
                
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}