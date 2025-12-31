import { useState, useEffect } from 'react'
import axios from 'axios'

export function User({user}) {
  return (
    <div>
      <li key={user.id}>
        <strong>{user.username}</strong>
        <ul>
          {user.rackets.map(owns => (
            <li key={owns.racket_id}>Owns: {owns.racket_brand} {owns.racket_name} ({owns.quantity})</li>
          ))}
        </ul>
        <ul>
          {user.orders.map(o => (
            <li key={o.id}>Ordered {o.racket_brand} {o.racket_name} to be strung by {o.due}</li>
          ))}
        </ul>
      </li>
    </div>      
  )
}

export const UserList = ({users, onUserDeleted}) => {
  const [newUsers, setNewUsers] = useState(users);

  const deleteUser = async (user) => {
    try {
      await axios.delete(`http://localhost:5000/delete-user/${user.id}`)

      onUserDeleted()
    } catch (error) {
      console.log("Error:", error)
    }
  }

  useEffect(() => {
    setNewUsers(users)
  }, [users])

  return(
    <div>
      <h2>Users</h2>
      <ul>
        {newUsers.map(u => (
          <div key={u.id} >
            <User user={u} onUserDeleted={() => onUserDeleted()}/>
            <button onClick={() => {deleteUser(u)}}>X</button>  
          </div>
        ))}
      </ul>
    </div>
  )
}

export const UserForm = ({ onUserCreated }) => {
  const [username, setUsername] = useState('');

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/create-user", {
        "username": username
      })
      
      setUsername('');

      onUserCreated();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else{
        setError("Could not connect to server.");
      }
    }
  }

  return(
    <div>
      <h2>Create a user</h2>
      {error && <div>{error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>

        <label htmlFor="username">User Name:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
    
  )
}