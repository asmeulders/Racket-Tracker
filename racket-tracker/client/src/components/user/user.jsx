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
      <div>
        <li key={user.id}>
          <strong>{user.username}</strong>
          <ul>
            {user.rackets.map(owns => (
              <li key={owns.racket_id}>Owns: {owns.racket_name} ({owns.quantity})</li>
            ))}
          </ul>
          <ul>
            {user.orders.map(o => (
              <li key={o.id}>Ordered {o.racket_name} to be strung by {o.due}</li>
            ))}
          </ul>
        </li>
      </div>      
    )
}