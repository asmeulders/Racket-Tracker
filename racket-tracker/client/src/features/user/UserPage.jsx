import { useState, useEffect } from 'react';
import { UserForm } from './User';
import { fetchUsers } from '../../common/db_utils';

export function UserPage() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers({onComplete: setUsers});
    }, []);

    return(
        <div>
            {/* <UserList users={users} onUserDeleted={() => fetchUsers({onComplete: setUsers})} /> */}
            <UserForm onUserCreated={() => fetchUsers({onComplete: setUsers})}/>
        </div>
    )
}