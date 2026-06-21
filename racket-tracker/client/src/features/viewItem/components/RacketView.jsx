import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useRacket } from '../../racket/useRacket';
import { BrandSelect } from '../../brand';
import { useDatabase } from '../../../utils/useDatabase';
import { useViewItem } from '../useViewItem';

export function RacketView({data, setData}) {
    const { getRacket, deleteRacket, updateRacket } = useRacket();
    const { getList } = useViewItem();

    const [ racket, setRacket ] = useState({});
    const [ updatedRacket, setUpdatedRacket ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);
    const [editData, setEditData] = useState({
        brands: []
    }); 

    useEffect(() => {
        console.log(data);
        setRacket(data);
    }, [data]);

    if (Object.keys(racket).length === 0) return <div>Racket not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this racket?");
        if (confirmed) {
            deleteRacket(racket.id);
            navigate('/store-dashboard');
        }
    }

    const handleEdit = async () => {
        const list = await getList('brands');
        setEditData(prev => ({ ...prev, brands: list }));
        setUpdatedRacket({...racket})
        setIsEditing(true);
    }

    const handleSave = async () => {
        const res = await updateRacket({
            racketId: racket.id,
            brandId: updatedRacket.brandId,
            name: updatedRacket.name,
            price: updatedRacket.price
        });

        setData(res.data.racket);
        setUpdatedRacket({});
        setIsEditing(false);
    }

    const handleNewBrand = async () => {
        const lsit = await getList('brands');
        setEditData({ brands: list });
    }

    return (
        <div className='item-page'>
            <div className='item-card'>
                <div className='item-fields'>
                    <span className='field-label'>Brand:</span>
                    {isEditing ?
                        <BrandSelect 
                            value={updatedRacket.brandId} 
                            brands={editData.brands}
                            onBrandChange={setUpdatedRacket}
                            onDataCreated={handleNewBrand}
                        /> :
                        <span className='field-details'>{racket.brandName}</span>
                    }

                    <span className='field-label'>Racket Name:</span>
                    {isEditing ?
                        <input 
                            type='text'
                            placeholder='Racket Name'
                            value={updatedRacket.name} 
                            onChange={(e) => setUpdatedRacket(prev => ({...prev, name: e.target.value}))}
                        /> :
                        <span className='field-details'>{racket.name}</span>
                    }

                    <span className='field-label'>Price:</span>
                    {isEditing ?
                        <input
                            id='price'
                            type='number' 
                            step='0.01'
                            min='0'
                            placeholder='Racket Price'
                            value={updatedRacket.price} 
                            onChange={(e) => setUpdatedRacket(prev => ({...prev, price: e.target.value}))}
                        /> :
                        <span className='field-details'>{racket.price}</span>
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