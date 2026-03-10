export const StringSelect = ({ onStringChange, value, strings }) => {
  const handleSelect = (event) => {
    const stringId = event.target.value;
    onStringChange(stringId);
  }
  
  return (
    <div>
      <label htmlFor='string'>String:</label>
      <select name="strings" id="string" value={value} required onChange={handleSelect}>
        <option value="">--Please choose a string--</option>
        {strings.map(string => (
          <option key={string.id} value={string.id}>{string.brand_name} {string.name}</option>
        ))}
      </select>
    </div>
    
  )
}