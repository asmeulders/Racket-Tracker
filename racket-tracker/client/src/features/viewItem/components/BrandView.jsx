import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useBrand } from '../../brand/useBrand';

export function BrandView({data, setData}) {
    const navigate = useNavigate();
    const { getBrand, deleteBrand, updateBrand } = useBrand();

    const [ brand, setBrand ] = useState({});
    const [ updatedBrand, setUpdatedBrand ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        setBrand(data);
    }, [data]);

    if (Object.keys(brand).length === 0) return <div>Brand not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this brand?");
        if (confirmed) {
            await deleteBrand(brand.id);
            navigate('/store/view-list/brands');
        }
    }

    const handleEdit = async () => {
        setUpdatedBrand({...brand})
        setIsEditing(true);
    }

    const handleSave = async () => {
        const res = await updateBrand({
            brandId: brand.id,
            name: updatedBrand.name
        });
        setData(res.data.brand);
        setUpdatedBrand({});
        setIsEditing(false);
    }

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

                <div className="item-actions">
                    {isEditing ? 
                        <button className="action-btn" onClick={() => handleSave()}>Save</button> :
                        <button className="action-btn" onClick={async () => await handleEdit()}>Edit</button>
                    }
                    <button className="action-btn" onClick={handleDelete}>Delete Brand</button>
                    <button className="action-btn" onClick={() => navigate('/store/new-item/brands')}>Create New Brand</button>
                </div>   
            </div>
        </div>
    );
};