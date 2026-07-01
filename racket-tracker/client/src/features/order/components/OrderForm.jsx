import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useOrder } from '../useOrder';
import { UserSelect } from '../../user';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';

export const OrderForm = ({ onDataCreated, order, rackets, strings, users }) => {
    const { createOrder, updateOrder } = useOrder();

    const [fields, setFields] = useState({
        orderId: order ? order.id : null,
        racketId: order ? order.racketId : '',
        userId: order ? order.userId : '',
        mainsId: order ? order.mainsId : '',
        mainsTension: order ? order.mainsTension : '',
        crossesId: order ? order.crossesId : '',
        crossesTension: order ? order.crossesTension : '',
        sameForCrosses: order ? order.sameForCrosses : true,
        paid: order ? order.paid : false,
        due: order ? order.due : null,
        price: order ? order.price : null
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
            const newOrder = await (order === null ? createOrder : updateOrder)(fields);
            onDataCreated(newOrder.id);
        }     
        setValidated(true);   
    };

    return(
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <UserSelect onUserChange={setFields} value={fields.userId} users={users} />
                <RacketSelect onRacketChange={setFields} value={fields.racketId} rackets={rackets}/>
                <StringSelect onStringChange={setFields} value={fields.mainsId} strings={strings} direction='mains'/>
            
                <Form.Group>
                    <Form.Label>
                        Mains Tension:
                    </Form.Label>
                    <Form.Control 
                        type='number' 
                        id='tension' 
                        min={0}
                        max={100}
                        value={fields.mainsTension} 
                        onChange={(e) => setFields(prev => ({ ...prev, mainsTension: e.target.value }))} 
                    />
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
                        <Form.Control 
                            type='number' 
                            id='crossesTension' 
                            min={0}
                            max={100}
                            value={fields.crossesTension} 
                            onChange={(e) => setFields(prev => ({ ...prev, crossesTension: e.target.value }))}
                        />
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
    )
}