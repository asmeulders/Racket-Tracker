import { useState, useEffect } from 'react'
import axios from 'axios'
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import './User.css'
import { Inquiry } from '../inquiry/Inquiry';

export function User({user}) {
  return (
    <div key={user.id} className='user-container'>
      <strong>{user.username}</strong>
      <div className='owns-container'>
        Owns:
        <ul className='owns-racket'>
          {user.rackets?.map(owns => (
            <li key={owns.racket_id}> {owns.racket_brand} {owns.racket_name} ({owns.quantity})</li>
          ))}
        </ul>
      </div>
      <div className='user-orders-container'>
        Orders:
        <ul className='user-order'>
          {user.orders?.map(o => (
            <li key={o.id}>{format(new Date(o.order_date), 'MM/dd/yyyy')}: {o.racket_brand} {o.racket_name}</li>
          ))}
        </ul>
      </div>
    </div>   
  )
}

// export const UserList = ({users, onUserDeleted}) => {
//   const [newUsers, setNewUsers] = useState(users);

//   const deleteUser = async (user) => {
//     try {
//       await axios.delete(`http://localhost:5000/delete-user/${user.id}`)

//       onUserDeleted()
//     } catch (error) {
//       console.log("Error:", error)
//     }
//   }

//   useEffect(() => {
//     setNewUsers(users)
//   }, [users])

//   return(
//     <div>
//       <ul>
//         {newUsers.map(u => (
//           <div key={u.id} >
//             <User user={u} onUserDeleted={() => onUserDeleted()}/>
//             <button onClick={() => {deleteUser(u)}}>X</button>  
//           </div>
//         ))}
//       </ul>
//     </div>
//   )
// }

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

export const UserSelect = ({ onUserChange, value, users }) => {
  const handleSelect = (event) => {
    const userId = event.target.value;
    onUserChange(userId);
  }

  return (
    <div>
      <label htmlFor='user'>User:</label>
      <select name="users" id="user" value={value} required onChange={handleSelect}>
        <option value="">--Please choose a user--</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
    </div>
    
  )
}

export const UserFilter = ({onFilterChange}) => {
  /**
   * The filter component for a user in the dashboard.
   * Filters:
   *  - User Name
   */

  return (
    <div className='filter-container'>
      <input type="text" placeholder='User Name' onChange={(e) => onFilterChange(e.target.value)}/>
    </div>
  )
}