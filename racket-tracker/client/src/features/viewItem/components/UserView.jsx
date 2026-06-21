import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useUser } from '../../user/useUser';
import { BrandSelect } from '../../brand';

export function UserView({data, setData}) {
    const { deleteUser, updateUser } = useUser();

    const [ user, setUser ] = useState({});
    const [ updatedUser, setUpdatedUser ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        setUser(data);
    }, [data]);

    if (Object.keys(user).length === 0) return <div>User not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            deleteUser(user.id);
            navigate('/store-dashboard');
        }
    }

    const handleEdit = async () => {
        setUpdatedUser({
            ...user,
            phone: user.phone ?? '',
        });
        setIsEditing(true);
    }

    const handleSave = async () => {
        const phone = updatedUser.phone !== "" ? updatedUser.phone : "NONE";
        const res = await updateUser({
            userId: user.id,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: phone,
            email: updatedUser.email
        });

        setData(res.data.user);
        setUpdatedUser({});
        setIsEditing(false);
    }

    return (
        <div className='item-page'>
            <div className='item-card'>
                <div className='item-fields'>
                    <span className='field-label'>Username:</span>
                    {isEditing ?
                        <input 
                            id='username'
                            type='text'
                            placeholder='Username'
                            value={updatedUser.username}
                            onChange={(e) => setUpdatedUser(prev => ({...prev, username: e.target.value}))}
                        /> :
                        <span className='field-details'>{user.username}</span>
                    }

                    <span className='field-label'>First Name:</span>
                    {isEditing ?
                        <input 
                            id='firstName'
                            type='text'
                            placeholder='First Name'
                            value={updatedUser.firstName}
                            onChange={(e) => setUpdatedUser(prev => ({...prev, firstName: e.target.value}))}
                        /> :
                        <span className='field-details'>{user.firstName}</span>
                    }

                    <span className='field-label'>Last Name:</span>
                    {isEditing ?
                        <input 
                            id='lastName'
                            type='text'
                            placeholder='Last Name'
                            value={updatedUser.lastName}
                            onChange={(e) => setUpdatedUser(prev => ({...prev, lastName: e.target.value}))}
                        /> :
                        <span className='field-details'>{user.lastName}</span>
                    }

                    <span className='field-label'>Phone Number:</span>
                    {isEditing ?
                        <input 
                            id='phone'
                            type='tel'
                            placeholder='Phone Number'
                            value={updatedUser.phone}
                            onChange={(e) => setUpdatedUser(prev => ({...prev, phone: e.target.value}))}
                        /> :
                        <span className='field-details'>{user.phone ? user.phone : 'N/A'}</span>
                    }

                    <span className='field-label'>Email:</span>
                    {isEditing ?
                        <input 
                            id='email'
                            type='text'
                            placeholder='Email'
                            value={updatedUser.email}
                            onChange={(e) => setUpdatedUser(prev => ({...prev, email: e.target.value}))}
                        /> :
                        <span className='field-details'>{user.email}</span>
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