import Form from 'react-bootstrap/Form';

export const StringSelect = ({ onStringChange, value, strings }) => {
  const handleSelect = (event) => {
    const stringId = event.target.value;
    onStringChange(prev => ({ ...prev, stringId: stringId}));
  }
  
  return (
    <Form.Group>
      <Form.Label>
        String: 
      </Form.Label>
      <Form.Select name="strings" id="string" value={value} required onChange={handleSelect} >
        <option value="">--Please choose a string--</option>
          {strings?.map(string => (
            <option key={string.id} value={string.id}>{string.brand_name} {string.name}</option>
          ))}
      </Form.Select>
    </Form.Group>
  )
}