import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { EditOrder, EditRacket, EditString } from './index';
import { BrandForm } from '../brand';
import { UserForm } from '../user';
import { useViewItem } from '../viewItem/useViewItem';
import { StorePageLayout } from '../store';


// TODO: going to get rid of this because i want to use modals instead
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
        brands: BrandForm,
        users: UserForm,
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
        <StorePageLayout
            title={"Edit Item"}
        >
            <Component onEditItem={handleEditItem} item={item}/>
        </StorePageLayout>
    );
}