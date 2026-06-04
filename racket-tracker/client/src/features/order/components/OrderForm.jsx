import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useOrder } from '../useOrder';
import { UserSelect } from '../../user';
import { RacketSelect } from '../../racket';
import { StringSelect } from '../../string';

export const OrderForm = ({ onOrderCreated, rackets, strings, users }) => {
    const { createOrder } = useOrder();
    
    const [racketId, setRacketId] = useState("");
    const [userId, setUserId] = useState('');
    const [stringId, setStringId] = useState("");
    const [tension, setTension] = useState('');
    const [sameForCrosses, setSameForCrosses] = useState(true);
    const [crossesId, setCrossesId] = useState("");
    const [crossesTension, setCrossesTension] = useState('');
    const [paid, setPaid] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createOrder({ racketId, userId, stringId, tension, crossesId, crossesTension, sameForCrosses, paid });

        setRacketId("");
        setUserId('');
        setStringId("");
        setTension('');
        setCrossesId("");
        setCrossesTension('');
        setSameForCrosses(true);
        setPaid(false);
        onOrderCreated();
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>Create an Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                
                   <UserSelect onUserChange={setUserId} value={userId} users={users} />

                   <RacketSelect onRacketChange={setRacketId} value={racketId} rackets={rackets}/>
                
                   <StringSelect onStringChange={setStringId} value={stringId} strings={strings} />
                
                    <Form.Group>
                        <Form.Label>
                            Mains Tension:
                        </Form.Label>
                        <Form.Control type='number' id='tension' value={tension} onChange={(e) => setTension(e.target.value)} >

                        </Form.Control>
                    </Form.Group>

                    <Form.Check 
                        type='checkbox'
                        id="sameForCrosses"
                        onChange={(e) => setSameForCrosses(e.target.checked)}
                        checked={sameForCrosses}
                        label={sameForCrosses ? 'Same for crosses' : 'Different for crosses'}
                    />
                
                    {!sameForCrosses && 
                    <div>
                        <StringSelect onStringChange={setCrossesId} value={crossesId} strings={strings} />
                    
                        <Form.Group>
                            <Form.Label>
                                Crosses Tension:
                            </Form.Label>
                            <Form.Control type='number' id='crossesTension' value={crossesTension} onChange={(e) => setCrossesTension(e.target.value)} >

                            </Form.Control>
                        </Form.Group>
                    </div>
                    }

                    <Form.Check 
                        type='checkbox'
                        id="paid"
                        onChange={(e) => setPaid(e.target.checked)}
                        checked={paid}
                        label="Paid"
                    />

                </form>
            </Modal.Body>
        </>
    )
}