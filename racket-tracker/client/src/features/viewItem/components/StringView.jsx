import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useString } from '../../string/useString';
import { BrandSelect } from '../../brand';

export function StringView({data, setData}) {
    const { getString, deleteString, updateString } = useString();

    const [ string, setString ] = useState({});
    const [ updatedString, setUpdatedString ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);

    const [editData, setEditData] = useState({
        brands: []
    }); 

    useEffect(() => {
        setString(data);
    }, []);

    if (Object.keys(string).length === 0) return <div>String not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this string?");
        if (confirmed) {
            deleteString(stringId);
            navigate('/store-dashboard');
        }
    }

    const handleEdit = async () => {
        const data = await fetchData({ table: 'brands' });
        setEditData(prev => ({ ...prev, brands: data }));
        setUpdatedString({...string})
        setIsEditing(true);
    }

    const handleSave = async () => {
        console.log("string saved: ", stringId);

        const res = await updateString({
            stringId: stringId,
            brandId: updatedString.brandId,
            name: updatedString.name,
            pricePerRacket: updatedString.pricePerRacket
        });
        console.log(res);

        setString(res.data.string);
        setUpdatedString({});
        setIsEditing(false);
    }

    const handleNewBrand = async () => {
        const data = await fetchData({ table: 'brands'});
        setEditData({ brands: data });
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