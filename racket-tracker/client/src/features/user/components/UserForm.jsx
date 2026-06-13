import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useUser } from '../useUser';

export const UserForm = ({ onDataCreated, handleClose }) => {
    const { createUser } = useUser();
    const [username, setUsername] = useState('');

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            console.log("Please fill in all required fields");
        } else {
            await createUser({ username });
            setUsername('');
            onDataCreated('users', true);
        }
        setValidated(true); // triggers visual feedback
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>Create a User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>User Name:</Form.Label>
                        <Form.Control type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button type='submit' variant="primary">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}