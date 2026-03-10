import { useState } from 'react';

import { useUser } from '../useUser';

export const UserForm = ({ onUserCreated }) => {
    const { createUser } = useUser();
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createUser(username);
        
        setUsername('');
        onUserCreated();
    }

    return(
        <div>
            <h2>Create a user</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">User Name:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />

                <input type="submit" value="Submit" />
            </form>
        </div>
        
    )
}