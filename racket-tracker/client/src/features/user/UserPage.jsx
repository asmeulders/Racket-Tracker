import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useUser } from './useUser';
import { BrandSelect } from '../brand';
import { fetchData } from '../../utils/db_utils';

export function UserPage() {
    const { getUserById, deleteUser, updateUser } = useUser();
    const { userId } = useParams();

    const [ user, setUser ] = useState({});
    const [ updatedUser, setUpdatedUser ] = useState({});
    const [ loading, setLoading ] = useState(true);

    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        getUserById(userId)
            .then(data => setUser(data))
            .finally(() => setLoading(false));
    }, [userId])

    if (loading) return <div>Loading...</div>;
    if (Object.keys(user).length === 0) return <div>User not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            deleteUser(userId);
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
        console.log("User saved: ", userId);
        console.log(updatedUser);

        const res = await updateUser({
            userId: userId,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phone,
            email: updatedUser.email
        });
        console.log(res);

        setUser(res.data.user);
        setUpdatedUser({});
        setIsEditing(false);
    }

    // TODO: make css general for these?
    return (
        <div className='user-page'>
            <div className='user-card'>
                <div className='user-details'>
                    <span className='field-label'>Username:</span>
                    {isEditing ?
                        <input 
                            id='username'
                            type='text'
                            placeholder='Username'
                            value={updatedUser.username}
                            onChange={(e) => setUpdatedUser(prev => ({...prev, username: e.target.value}))}
                        /> :
                        <span>{user.username}</span>
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
                        <span>{user.firstName}</span>
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
                        <span>{user.lastName}</span>
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
                        <span>{user.phone}</span>
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
                        <span>{user.email}</span>
                    }
                </div>
                <div className='user-edit-btn'>
                    {isEditing ? 
                        <button onClick={() => handleSave()}>Save</button> :
                        <button onClick={async () => await handleEdit()}>Edit</button>
                    }
                </div>
            </div>
        </div>
    );
};