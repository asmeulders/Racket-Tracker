import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useBrand } from './useBrand';
import { BrandSelect } from '../brand';

export function BrandPage() {
    const { getBrandById, deleteBrand, updateBrand } = useBrand();
    const { brandId } = useParams();

    const [ brand, setBrand ] = useState({});
    const [ updatedBrand, setUpdatedBrand ] = useState({});
    const [ loading, setLoading ] = useState(true);

    const [editData, setEditData] = useState({
        brands: []
    }); 

    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        getBrandById(brandId)
            .then(data => setBrand(data))
            .finally(() => setLoading(false));
    }, [brandId])

    if (loading) return <div>Loading...</div>;
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

    // TODO: make css general for these?
    return (
        <div className='brand-page'>
            <div className='brand-card'>
                <div className='brand-details'>
                    <span className='field-label'>Brand Name:</span>
                    {isEditing ?
                        <input id='brand-name' type='text' placeholder='Brand Name' value={updatedBrand.name} onChange={(e) => setUpdatedBrand(prev => ({...prev, name: e.target.value}))}>
                        </input> :
                        <span>{brand.name}</span>
                    }
                </div>
                <div className='brand-edit-btn'>
                    {isEditing ? 
                        <button onClick={() => handleSave()}>Save</button> :
                        <button onClick={async () => await handleEdit()}>Edit</button>
                    }
                </div>
            </div>
        </div>
    );
};