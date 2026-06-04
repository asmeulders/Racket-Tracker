import Form from 'react-bootstrap/Form';

export const UserSelect = ({ onUserChange, value, users }) => {
    const handleSelect = (event) => {
        const userId = parseInt(event.target.value);
        onUserChange(userId);
    }

    return (
        <Form.Group>
            <Form.Label>
                Users: 
            </Form.Label>
            <Form.Select name="users" id="user" value={value} onChange={handleSelect} required >
                <option value="">--Please choose a user--</option>
                {users?.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
                ))}
            </Form.Select>
        </Form.Group>
    )
}