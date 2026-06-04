import Form from 'react-bootstrap/Form';

export const RacketSelect = ({ onRacketChange, value, rackets }) => {
  const handleSelect = (event) => {
    const racketId = event.target.value;
    onRacketChange(racketId);
  }
  
  return (
    <Form.Group>
      <Form.Label>
        Racket: 
      </Form.Label>
      <Form.Select name="rackets" id="racket" value={value} required onChange={handleSelect} >
        <option value="">--Please choose a racket--</option>
          {rackets?.map(racket => (
            <option key={racket.id} value={racket.id}>{racket.brand_name} {racket.name}</option>
          ))}
      </Form.Select>
    </Form.Group>
  )
}

