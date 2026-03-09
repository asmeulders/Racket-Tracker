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