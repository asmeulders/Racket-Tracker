import { useState, useEffect } from 'react'
import axios from 'axios'

import { UserList, UserForm } from '../../components/user/user'
import { fetchUsers } from '../../common/db_utils'

export function UserPage() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers({onComplete: setUsers});
    }, []);

    return(
        <div>
            <UserList users={users} onUserDeleted={() => fetchUsers({onComplete: setUsers})} />
            <UserForm onUserCreated={() => fetchUsers({onComplete: setUsers})}/>
        </div>
    )
}