import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { BrandSelect } from '../../brand';
import { useString } from '../index';

export const StringForm = ({ onDataCreated, brands }) => {
    const { createString } = useString(); // TODO: use nmbers for defaults and not all empty strings??
    const [fields, setFields] = useState({
        name: '',
        pricePerRacket: '',
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
            console.dir(errors);
        } else {
            setErrors({});
            const string = await createString({ 
                name: fields.name,
                pricePerRacket: fields.pricePerRacket, 
                brandId: fields.brandId
            });
            setFields({
                name: '',
                pricePerRacket: '',
                brandId: ''
            });
            onDataCreated(string.id);
        }       
        setValidated(true);
    }

    const validate = () => {
        const customErrors = {};
        if (fields.pricePerRacket < 0) {
            customErrors.pricePerRacket = 'Price must be a positive number.';
        }
        return customErrors;
    };

    return(
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <BrandSelect value={fields.brandId} brands={brands} onBrandChange={setFields} onDataCreated={onDataCreated}/>

            <Form.Group>
                <Form.Label>
                    String Name:
                </Form.Label>
                <Form.Control type='text' id='name' value={fields.name} onChange={(e) => setFields(prev => ({ ...prev, name: e.target.value }))} >

                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    Price per Racket:
                </Form.Label>
                <Form.Control 
                    id='price'
                    type='number'  
                    step='0.01'
                    min='0'
                    value={fields.pricePerRacket} 
                    onChange={(e) => setFields(prev => ({ ...prev, pricePerRacket: e.target.value }))} 
                />
            </Form.Group>

            <Button type='submit' variant="primary">Create</Button>
        </Form>
    )
}