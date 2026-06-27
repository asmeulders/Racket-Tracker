import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useString } from '../../string/useString';
import { BrandSelect } from '../../brand';
import { useViewItem } from '../useViewItem';

export function StringView({data, setData}) {
    const { getString, deleteString, updateString } = useString();
    const { getList } = useViewItem();

    const [ string, setString ] = useState({});
    const [ updatedString, setUpdatedString ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);
    const [editData, setEditData] = useState({
        brands: []
    }); 

    useEffect(() => {
        setString(data);
    }, [data]);

    if (Object.keys(string).length === 0) return <div>String not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this string?");
        if (confirmed) {
            await deleteString(string.id);
            navigate('/store');
        }
    }

    const handleEdit = async () => {
        const list = await getList('brands');
        setEditData(prev => ({ ...prev, brands: list }));
        setUpdatedString({...string})
        setIsEditing(true);
    }

    const handleSave = async () => {
        const res = await updateString({
            stringId: string.id,
            brandId: updatedString.brandId,
            name: updatedString.name,
            pricePerRacket: updatedString.pricePerRacket
        });

        setData(res.data.string);
        setUpdatedString({});
        setIsEditing(false);
    }

    const handleNewBrand = async () => {
        const list = await getList('brands');
        setEditData({ brands: list });
    }

    // TODO: make css general for these?
    return (
        <div className='item-page'>
            <div className='item-card'>
                <div className='item-fields'>
                    <span className='field-label'>Brand:</span>
                    {isEditing ?
                        <BrandSelect 
                            value={updatedString.brandId} 
                            brands={editData.brands}
                            onBrandChange={setUpdatedString}
                            onDataCreated={handleNewBrand}
                        /> :
                        <span className='field-details'>{string.brandName}</span>
                    }

                    <span className='field-label'>String Name:</span>
                    {isEditing ?
                        <input 
                            type='text'
                            placeholder='String Name'
                            value={updatedString.name} 
                            onChange={(e) => setUpdatedString(prev => ({...prev, name: e.target.value}))}
                        /> :
                        <span className='field-details'>{string.name}</span>
                    }

                    <span className='field-label'>Price per Racket:</span>
                    {isEditing ?
                        <input
                            id='pricePerRacket'
                            type='number' 
                            step='0.01'
                            min='0'
                            placeholder='String Price per Racket'
                            value={updatedString.pricePerRacket} 
                            onChange={(e) => setUpdatedString(prev => ({...prev, pricePerRacket: e.target.value}))}
                        /> :
                        <span className='field-details'>{string.pricePerRacket}</span>
                    }
                </div>
                <div className="item-actions">
                    {isEditing ? 
                        <button className="action-btn" onClick={() => handleSave()}>Save</button> :
                        <button className="action-btn" onClick={async () => await handleEdit()}>Edit</button>
                    }
                    <button className="action-btn" onClick={handleDelete}>Delete String</button>
                    <button className="action-btn">Create New String</button>
                </div>   
            </div>
        </div>
    );
};