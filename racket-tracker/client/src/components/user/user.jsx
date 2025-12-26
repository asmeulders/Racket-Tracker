export function UserList({users}) {
    return(
        <div>
          <h2>Users</h2>
          <ul>
            {users.map(u => (
              <User key={u.id} user={u} />
            ))}
          </ul>
        </div>
    )
}

export function User({user}) {
    return (
      <li key={user.id}>
        <strong>{user.username}</strong>
        <ul>
          {user.rackets.map(r => (
            <li key={r.id}>Owns: {r.name}</li>
          ))}
        </ul>
      </li>
    )
}