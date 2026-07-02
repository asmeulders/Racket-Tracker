import Form from 'react-bootstrap/Form';

export const StringSelect = ({ onStringChange, value, strings, direction }) => {
  const handleSelect = (event) => {
    const stringId = event.target.value;
    switch (direction) {
      case 'mains':
        onStringChange(prev => ({ ...prev, mainsId: stringId}));
        break;
      
      case 'crosses':
        onStringChange(prev => ({ ...prev, crossesId: stringId}));
        break;

      default:
        console.log("Unknown direction");
        break;
    }
  }
  
  return (
    <Form.Group>
      <Form.Label>
        {direction} String: 
      </Form.Label>
      <Form.Select name="strings" id="string" value={value} required onChange={handleSelect} >
        <option value="">--Please choose a string--</option>
          {strings?.map(string => (
            <option key={string.id} value={string.id}>{string.brandName} {string.name}</option>
          ))}
      </Form.Select>
    </Form.Group>
  )
}