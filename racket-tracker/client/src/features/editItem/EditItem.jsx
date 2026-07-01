import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { EditOrder, EditRacket, EditString, EditBrand, EditUser } from './index';
import { useViewItem } from '../viewItem/useViewItem';

export const EditItem = () => {
    const navigate = useNavigate();
    const { getItem } = useViewItem();

    const { type, id } = useParams();

    const [ item, setItem ] = useState(null);

    const handleEditItem = () => {
        navigate(`/store/view-item/${type}/${id}`);
    }

    const page = {
        orders: EditOrder,
        brands: EditBrand,
        users: EditUser,
        rackets: EditRacket,
        strings: EditString,
    };
    const Component = page[type] ?? <p>Unknown type</p>;

    useEffect(() => {
        getItem(type, id)
            .then(data => setItem(data));
    }, []);

    if (item === null) return <p>Loading...</p>

    return (
        <div className='Edit-item-page'>
            <Component onEditItem={handleEditItem} item={item}/>
        </div>
    );
}