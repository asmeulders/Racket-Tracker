import { useState, useEffect } from 'react'
import axios from 'axios'
import './Inquiry.css';

export function Inquiry({inquiry, onDelete}) {
  
  return (
      <div className='inquiry-container'>
        {inquiry.name}
        <button 
          className="delete-btn"
          onClick={(order) => onDelete(order)}
          aria-label="Delete item"
        >
          X
      </button>
      </div>
  )
}

export const InquiryForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/create-inquiry", {
        "name": name,
        "phone": phone,
        "email": email,
        "message": message
      })
      
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');

      // onInquiryCreated();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else{
        console.log("Could not connect to server.");
      }
    }
  }

  return(
    <div>
      <h4>Request a service</h4>
      <form action="submit" className='contact-form' onSubmit={handleSubmit}>
          <label htmlFor="name" className='form-label' >Name:</label>
          <div className='form-input-field'><input type="text" id='name' placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          
          <label htmlFor="phone" className='form-label' >Phone Number:</label>
          <div className='form-input-field'><input type="tel" id='phone' placeholder='Your Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
          <label htmlFor="email" className='form-label' >Email:</label>
          <div className='form-input-field'><input type="email" id='email' placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <label htmlFor="message" className='form-label' >Message:</label>
          <div className='form-input-field'><textarea id="message" placeholder="Your Message" maxLength={200} rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
          </div>
          <button type="submit" className='submit-btn'>Submit Request</button>
      </form>
    </div>   
  )
}