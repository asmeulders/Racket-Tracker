import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useRacket } from './useRacket';
import { BrandSelect } from '../brand';
import { fetchData } from '../../utils/db_utils';

export function RacketPage() {
    const { getRacketById, deleteRacket, updateRacket } = useRacket();
    const { racketId } = useParams();

    const [ racket, setRacket ] = useState({});
    const [ updatedRacket, setUpdatedRacket ] = useState({});
    const [ loading, setLoading ] = useState(true);

    const [editData, setEditData] = useState({
        brands: []
    }); 

    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        getRacketById(racketId)
            .then(data => setRacket(data))
            .finally(() => setLoading(false));
    }, [racketId])

    if (loading) return <div>Loading...</div>;
    if (Object.keys(racket).length === 0) return <div>Racket not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this racket?");
        if (confirmed) {
            deleteRacket(racketId);
            navigate('/store-dashboard');
        }
    }

    const handleEdit = async () => {
        const data = await fetchData({ table: 'brands' });
        setEditData(prev => ({ ...prev, brands: data }));
        setUpdatedRacket({...racket})
        setIsEditing(true);
    }

    const handleSave = async () => {
        console.log("Racket saved: ", racketId);

        const res = await updateRacket({
            racketId: racketId,
            brandId: updatedRacket.brandId,
            name: updatedRacket.name,
            price: updatedRacket.price
        });
        console.log(res);

        setRacket(res.data.racket);
        setUpdatedRacket({});
        setIsEditing(false);
    }

    const handleNewBrand = async () => {
        const data = await fetchData({ table: 'brands'});
        setEditData({ brands: data });
    }

    // TODO: make css general for these?
    return (
        <div className='racket-page'>
            <div className='racket-card'>
                <div className='racket-details'>
                    <span className='field-label'>Brand:</span>
                    {isEditing ?
                        <BrandSelect 
                            value={updatedRacket.brandId} 
                            brands={editData.brands}
                            onBrandChange={setUpdatedRacket}
                            onDataCreated={handleNewBrand}
                        /> :
                        <span>{racket.brandName}</span>
                    }

                    <span className='field-label'>Racket Name:</span>
                    {isEditing ?
                        <input 
                            type='text'
                            placeholder='Racket Name'
                            value={updatedRacket.name} 
                            onChange={(e) => setUpdatedRacket(prev => ({...prev, name: e.target.value}))}
                        /> :
                        <span>{racket.name}</span>
                    }

                    <span className='field-label'>Price:</span>
                    {isEditing ?
                        <input
                            type='number' 
                            step='0.01'
                            min='0'
                            placeholder='Racket Price'
                            value={updatedRacket.price} 
                            onChange={(e) => setUpdatedRacket(prev => ({...prev, price: e.target.value}))}
                        /> :
                        <span>{racket.price}</span>
                    }
                </div>
                <div className='racket-edit-btn'>
                    {isEditing ? 
                        <button onClick={() => handleSave()}>Save</button> :
                        <button onClick={async () => await handleEdit()}>Edit</button>
                    }
                </div>
            </div>
        </div>
    );
};