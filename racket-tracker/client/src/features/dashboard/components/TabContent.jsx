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
            if (activeTab === "order") {
                await deleteOrder(item.id);
            } else if (activeTab === "racket") {
                await deleteRacket(item.id);
            } else if (activeTab === "string") {
                await deleteString(item.id);
            } else if (activeTab === "user") {
                await deleteUser(item.id);
            } else if (activeTab === "brand") {
                await deleteBrand(item.id);
            } else if (activeTab === "inquiry") {
                await deleteInquiry(item.id);
            } else {
                console.error("Unknown tab");
            }
            onDataDeleted();
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
                                <Dropdown onDelete={() => handleDelete(item)} onEdit={() => navigate(`/edit-order/${item.id}`)}></Dropdown>                        
                            </div>                        
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};