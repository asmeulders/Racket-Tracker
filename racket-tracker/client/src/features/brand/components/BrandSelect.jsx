import { useState } from 'react';
import Form from 'react-bootstrap/Form';

import { useBrand } from '../useBrand';
import { create } from 'axios';

export const BrandSelect = ({ onBrandChange, onDataCreated, value, brands }) => {
    const { createBrand } = useBrand();
    const [other, setOther] = useState('');

    const handleSelect = (event) => {
        const brandId = event.target.value;
        onBrandChange(prev => ({ ...prev, brandId: brandId}));
    }

    const handleClick = async () => {
        try {
            const res = await createBrand({ name: other });
            console.log(res);
            setOther('');
            onBrandChange(prev => ({...prev, brandId: res.data.brand.id}));
            onDataCreated('brands', false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Form.Group>
                <Form.Label>
                    Brand: 
                </Form.Label>
                <Form.Select name="brands" id="brand" value={value} required onChange={handleSelect} >
                    <option value="">--Please choose a brand--</option>
                    {brands?.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                    <option value='other'>Other</option>
                </Form.Select>
                {value === 'other' && 
                    <div className='other-brand-input'>
                        <Form.Control name='other-input' id='other-input' type='text' value={other} placeholder='Other Brand' onChange={(e) => {setOther(e.target.value)}}></Form.Control>
                        <button type='button' onClick={handleClick} >Save Brand</button>
                    </div>
                }
            </Form.Group>
        </>
        
    )
}

