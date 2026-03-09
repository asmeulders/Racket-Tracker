import { useNavigate } from 'react-router-dom';

import { Dropdown } from '../index';
import { useOrder } from '../../order';

export const TabContent = ({ items, renderItem, onDataDeleted, activeTab}) => {
    const navigate = useNavigate();
    const { deleteOrder } = useOrder();
    
    const handleDelete = async (item) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        if (confirmed) {
            // HOW TO MAKE GENERAL?
            await deleteOrder(item.id);
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