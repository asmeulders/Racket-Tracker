import { useState } from 'react';

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
        <div>
            <h2>Create an order</h2>
            <form onSubmit={handleSubmit}>
                <UserSelect onUserChange={setUserId} value={userId} users={users} />

                <RacketSelect onRacketChange={setRacketId} value={racketId} rackets={rackets}/>
                
                <StringSelect onStringChange={setStringId} value={stringId} strings={strings} />
                
                <label htmlFor="tension">Tension:</label>
                <input type="number" id="tension" value={tension} onChange={(e) => setTension(e.target.value)} /><br />

                <label htmlFor="sameForCrosses">{sameForCrosses ? 'Same for crosses' : 'Different for crosses'}</label>
                <input type="checkbox" id="sameForCrosses" onChange={(e) => setSameForCrosses(e.target.checked)} checked={sameForCrosses}/><br />
                
                {!sameForCrosses && 
                <div>
                    <StringSelect onStringChange={setCrossesId} value={crossesId} strings={strings} />
                    
                    <label htmlFor="crossesTension">crossesTension:</label>
                    <input type="number" id="crossesTension" value={crossesTension} onChange={(e) => setCrossesTension(e.target.value)} /><br />
                </div>
                }

                <label htmlFor="paid">Paid</label>
                <input type="checkbox" id='paid' onChange={(e) => setPaid(e.target.value)} checked={paid}/>

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}