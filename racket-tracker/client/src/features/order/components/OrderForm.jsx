import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useOrder } from '../useOrder';
import { UserSelect } from '../../user';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';

export const OrderForm = ({ onDataCreated, rackets, strings, users }) => {
    const { createOrder } = useOrder();

    const [fields, setFields] = useState({
        racketId: '',
        userId: '',
        mainsId: '',
        mainsTension: '',
        crossesId: '',
        crossesTension: '',
        sameForCrosses: true,
        paid: false
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
            const order = await createOrder({ 
                racketId: fields.racketId, 
                userId: fields.userId, 
                mainsId: fields.mainsId,
                mainsTension: fields.mainsTension, 
                crossesId: fields.crossesId, 
                crossesTension: fields.crossesTension, 
                sameForCrosses: fields.sameForCrosses, 
                paid: fields.paid 
            });
            onDataCreated(order.id);
        }     
        setValidated(true);   
    };

    const validate = () => {
        const customErrors = {};
        if (fields.mainsTension < 0 || fields.mainsTension > 80) {
            customErrors.mainsTension = 'Tension must be positive and below 80lbs.';
        }
        if (fields.crossesTension < 0 || fields.crossesTension > 80) {
            customErrors.crossesTension = 'Tension must be positive and below 80lbs.';
        }
        return customErrors;
    };

    return(
        <>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        
            <UserSelect onUserChange={setFields} value={fields.userId} users={users} />

            <RacketSelect onRacketChange={setFields} value={fields.racketId} rackets={rackets}/>
        
            <StringSelect onStringChange={setFields} value={fields.mainsId} strings={strings} direction='mains'/>
        
            <Form.Group>
                <Form.Label>
                    Mains Tension:
                </Form.Label>
                <Form.Control type='number' id='tension' value={fields.mainsTension} onChange={(e) => setFields(prev => ({ ...prev, mainsTension: e.target.value }))} >

                </Form.Control>
            </Form.Group>

            <Form.Check 
                type='checkbox'
                id="sameForCrosses"
                onChange={(e) => setFields(prev => ({ ...prev, sameForCrosses: e.target.checked}))}
                checked={fields.sameForCrosses}
                label={fields.sameForCrosses ? 'Same for crosses' : 'Different for crosses'}
            />
        
            {!fields.sameForCrosses && 
            <div>
                <StringSelect onStringChange={setFields} value={fields.crossesId} strings={strings} direction='crosses'/>
            
                <Form.Group>
                    <Form.Label>
                        Crosses Tension:
                    </Form.Label>
                    <Form.Control type='number' id='crossesTension' value={fields.crossesTension} onChange={(e) => setFields(prev => ({ ...prev, crossesTension: e.target.value }))} >

                    </Form.Control>
                </Form.Group>
            </div>
            }

            <Form.Check 
                type='checkbox'
                id="paid"
                onChange={(e) => setFields(prev => ({ ...prev, paid: e.target.checked }))}
                checked={fields.paid}
                label="Paid"
            />

            <Button type='submit' variant="primary">Create</Button>

            </Form>
        </>
    )
}