import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useUser } from '../useUser';

export const UserForm = ({ onDataCreated }) => {
    const { createUser } = useUser();
    const [ fields, setFields ] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    })

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            console.log("Please fill in all required fields");
        } else {
            const user = await createUser({ 
                username: fields.username,
                firstName: fields.firstName,
                lastName: fields.lastName,
                email: fields.email,
                phone: fields.phone
            });
            setFields({
                username: '',
                firstName: '',
                lastName: '',
                phone: '',
                email: ''
            });
            onDataCreated(user.id);
        }
        setValidated(true); // triggers visual feedback
    }

    return(
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Username:</Form.Label>
                <Form.Control 
                    id='username'
                    type='text' 
                    required
                    value={fields.username} 
                    onChange={(e) => setFields(prev => ({...prev, username: e.target.value}))}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control 
                    id='firstName'
                    type='text'  
                    required
                    value={fields.firstName} 
                    onChange={(e) => setFields(prev => ({...prev, firstName: e.target.value}))}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control 
                    id='lastName'
                    type='text'  
                    required
                    value={fields.lastName} 
                    onChange={(e) => setFields(prev => ({...prev, lastName: e.target.value}))}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                    id='email'
                    type='email' 
                    required 
                    value={fields.email} 
                    onChange={(e) => setFields(prev => ({...prev, email: e.target.value}))}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control 
                    id='phone'
                    type='tel'  
                    value={fields.phone} 
                    onChange={(e) => setFields(prev => ({...prev, phone: e.target.value}))}
                />
            </Form.Group>
            <Button type='submit' variant="primary">Create</Button>
        </Form>
    )
}