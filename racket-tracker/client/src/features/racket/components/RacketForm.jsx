import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { BrandSelect } from '../../brand/';
import { useRacket } from '../useRacket';

export const RacketForm = ({ onSubmit, brands }) => {
    const { createRacket } = useRacket();
    const [fields, setFields] = useState({
        name: '',
        price: '',
        brandId: ''
    });

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            console.log("Please fill in all required fields");
        } else {
            const racket = await createRacket({ 
                name: fields.name,
                price: fields.price, 
                brandId: fields.brandId
            });
            setFields({
                name: '',
                price: '',
                brandId: ''
            });
            onSubmit(racket);
        }
        setValidated(true);
    }

    return(
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <BrandSelect value={fields.brandId} brands={brands} onBrandChange={setFields} onSubmit={onSubmit} />
            <Form.Group>
                <Form.Label>
                    Racket Name:
                </Form.Label>
                <Form.Control type='text' id='name' value={fields.name} onChange={(e) => setFields(prev => ({ ...prev, name: e.target.value }))} />
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    Price:
                </Form.Label>
                <Form.Control 
                    id='price' 
                    type='number' 
                    step='0.01' 
                    min='0'
                    value={fields.price} 
                    onChange={(e) => setFields(prev => ({ ...prev, price: e.target.value }))} 
                />
            </Form.Group>

            <Button type='submit' variant="primary">Submit</Button>
        </Form>
    )
}