import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useBrand } from '../../brand/useBrand';

export function BrandView({data, setData}) {
    const { getBrand, deleteBrand, updateBrand } = useBrand();

    const [ brand, setBrand ] = useState({});
    const [ updatedBrand, setUpdatedBrand ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);

    if (Object.keys(brand).length === 0) return <div>Brand not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this brand?");
        if (confirmed) {
            deleteBrand(brandId);
            navigate('/store-dashboard');
        }
    }

    const handleEdit = async () => {
        setUpdatedBrand({...brand})
        setIsEditing(true);
    }

    const handleSave = async () => {
        console.log("Brand saved: ", brandId);

        const res = await updateBrand({
            brandId: brandId,
            name: updatedBrand.name
        });
        console.log(res);

        setBrand(res.data.brand);
        setUpdatedBrand({});
        setIsEditing(false);
    }

    useEffect(() => {
        setBrand(data);
    }, [])

    // TODO: make css general for these?
    return (
        <div className='item-page'>
            <div className='item-card'>
                <div className='item-fields'>
                    <span className='field-label'>Brand Name:</span>
                    {isEditing ?
                        <input id='brand-name' type='text' placeholder='Brand Name' value={updatedBrand.name} onChange={(e) => setUpdatedBrand(prev => ({...prev, name: e.target.value}))}>
                        </input> :
                        <span className='field-details'>{brand.name}</span>
                    }
                </div>
                <div className='item-edit-btn'>
                    {isEditing ? 
                        <button onClick={() => handleSave()}>Save</button> :
                        <button onClick={async () => await handleEdit()}>Edit</button>
                    }
                </div>
            </div>
        </div>
    );
};