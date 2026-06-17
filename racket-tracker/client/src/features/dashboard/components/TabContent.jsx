import { useNavigate } from 'react-router-dom';

import { Dropdown } from '../index';
import { useOrder } from '../../order';
import { useRacket } from '../../racket';
import { useString } from '../../string';
import { useUser } from '../../user';
import { useBrand } from '../../brand';
import { useInquiry } from '../../inquiry';

export const TabContent = ({ items, renderItem, onDataDeleted, activeTab}) => {
    const navigate = useNavigate();
    const { deleteOrder } = useOrder();
    const { deleteRacket } = useRacket();
    const { deleteString } = useString();
    const { deleteUser } = useUser();
    const { deleteBrand } = useBrand();
    const { deleteInquiry } = useInquiry();

    
    const handleDelete = async (item) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        if (confirmed) {
            if (activeTab === "orders") {
                await deleteOrder(item.id);
            } else if (activeTab === "rackets") {
                await deleteRacket(item.id);
            } else if (activeTab === "strings") {
                await deleteString(item.id);
            } else if (activeTab === "users") {
                await deleteUser(item.id);
            } else if (activeTab === "brands") {
                await deleteBrand(item.id);
            } else if (activeTab === "inquiries") {
                await deleteInquiry(item.id);
            } else {
                console.error("Unknown tab.");
            }
            onDataDeleted(item.id);
        }
    };

    const handleEdit = async (item) => {
        if (activeTab === "orders") {
            await navigate(`/view-order/${item.id}`);
        } else if (activeTab === "rackets") {
            await navigate(`/view-racket/${item.id}`);
        } else if (activeTab === "strings") {
            await navigate(`/view-string/${item.id}`);
        } else if (activeTab === "users") {
            await navigate(`/view-user/${item.id}`);
        } else if (activeTab === "brands") {
            await navigate(`/view-brand/${item.id}`);
        } else if (activeTab === "inquiries") {
            await navigate(`/view-inquiry/${item.id}`);
        } else {
            console.error("Unknown tab.");
        }
    };

    return (
        <div className="tab-content">
            {items.length === 0 ? (
                <p>No data found.</p>
            ) : (
                <ul className="data-list">
                    {items.map((item) => (
                        <li key={item.id} className="data-item">
                            <div className="item-content">
                                {renderItem(item, onDataDeleted)}
                            </div>
                            <div className='item-actions'>
                                <button type='button' onClick={() => handleDelete(item)}>Delete</button>
                                <button type='button' onClick={() => handleEdit(item)}>Edit</button>      
                            </div>          
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};