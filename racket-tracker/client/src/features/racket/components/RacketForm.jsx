import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { BrandSelect } from '../../brand/';
import { useRacket } from '../useRacket';

export const RacketForm = ({ onDataCreated, handleClose, brands }) => {
    const { createRacket } = useRacket();
    const [fields, setFields] = useState({
        name: '',
        price: '',
        brandId: ''
    });

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const newErrors = validate();

        if (form.checkValidity() === false || Object.keys(newErrors).length > 0) {
            e.stopPropagation();
            setErrors(newErrors);
            console.log("Please fill in all required fields");
            console.dir(errors)
        } else {
            setErrors({});
            await createRacket({ 
                name: fields.name,
                price: fields.price, 
                brandId: fields.brandId
            });
            setFields({
                name: '',
                price: '',
                brandId: ''
            });
            onDataCreated('rackets', true);
        }
        setValidated(true);
    }

    const validate = () => {
        const customErrors = {};
        if (fields.price < 0) {
            customErrors.price = 'Price must be a positive number.';
        }
        return customErrors;
    };

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>Create a Racket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                
                    <BrandSelect value={fields.brandId} brands={brands} onBrandChange={setFields} onDataCreated={onDataCreated} />
                
                    <Form.Group>
                        <Form.Label>
                            Racket Name:
                        </Form.Label>
                        <Form.Control type='text' id='name' value={fields.name} onChange={(e) => setFields(prev => ({ ...prev, name: e.target.value }))} >

                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Price:
                        </Form.Label>
                        <Form.Control type='number' id='price' value={fields.price} onChange={(e) => setFields(prev => ({ ...prev, price: e.target.value }))} >

                        </Form.Control>
                    </Form.Group>

                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button type='submit' variant="primary">Create</Button>

                    </Form>
            </Modal.Body>
        </>
    )
}