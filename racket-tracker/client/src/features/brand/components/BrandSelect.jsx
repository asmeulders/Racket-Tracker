import Form from 'react-bootstrap/Form';

export const BrandSelect = ({ onBrandChange, value, brands }) => {
    const handleSelect = (event) => {
        const brandId = event.target.value;
        onBrandChange(prev => ({ ...prev, brandId: brandId}));
    }
    
    return (
        <>
            <Form.Group>
                <div className='select-header'>
                    <Form.Label>
                        Brand: 
                    </Form.Label>
                    <button className='new-brand-btn' onClick={() => {console.log("New brand.")}}>New Brand +</button>
                </div>
                <Form.Select name="brands" id="brand" value={value} required onChange={handleSelect} >
                    <option value="">--Please choose a brand--</option>
                    {brands?.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>
        </>
        
    )
}

