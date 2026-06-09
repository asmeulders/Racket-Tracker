import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useBrand } from '../useBrand';

export const BrandForm = ({ onBrandCreated, handleClose }) => {
    const { createBrand } = useBrand()
    const [name, setName] = useState('');

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            console.log("Please fill in all required fields");
        } else {
            await createBrand({ name });
            setName('');
            onBrandCreated();
        }
        setValidated(true); // triggers visual feedback
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>Create a Brand</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Brand Name:</Form.Label>
                        <Form.Control type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button type='submit' variant="primary">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}