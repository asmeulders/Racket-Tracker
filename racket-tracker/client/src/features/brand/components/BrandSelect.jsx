import { useState } from 'react';
import Form from 'react-bootstrap/Form';

import { BrandButton } from './BrandButton';
import { useBrand } from '../useBrand';
import { create } from 'axios';

export const BrandSelect = ({ onBrandChange, value, brands }) => {
    const { createBrand } = useBrand();
    const [other, setOther] = useState('');

    const handleSelect = (event) => {
        const brandId = event.target.value;
        onBrandChange(prev => ({ ...prev, brandId: brandId}));
    }

    const handleClick = () => {
        try {
            createBrand({ name: other });
            setOther('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Form.Group>
                <div className='select-header'>
                    <Form.Label>
                        Brand: 
                    </Form.Label>
                    <BrandButton />
                </div>
                <Form.Select name="brands" id="brand" value={value} required onChange={handleSelect} >
                    <option value="">--Please choose a brand--</option>
                    {brands?.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                    <option value='other'>Other</option>
                </Form.Select>
                {value === 'other' && 
                    <div className='other-brand-input'>
                        <Form.Control name='other-input' id='other-input' type='text' placeholder='Other Brand' onChange={(e) => {setOther(e.target.value)}}></Form.Control>
                        <button type='button' onClick={handleClick} >Save Brand</button>
                    </div>
                }
            </Form.Group>
        </>
        
    )
}

