import { useState, useEffect } from 'react'
import axios from 'axios'
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import './Inquiry.css';

export function Inquiry({inquiry, onDelete}) {
  const displayDate = inquiry.date ? format(parseISO(inquiry.date), 'MM/dd/yyyy') : null;
  
  console.log(inquiry.date, displayDate)
  return (
      <div className='inquiry-container'>
        <div className='inquiry-header'>
          {displayDate ? `${displayDate}:` : ''} {inquiry.name}
        </div>
        <div className='contact-information'>
          <ul>
            <li>Phone number: {inquiry.phone}</li>
            <li>Email: {inquiry.email}</li>
          </ul>
        </div>
        <div className='message-container'>Message: {inquiry.message}</div>
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
    <div className='contact-form-container'>
      <div className='form-header'><h2>Need a racket strung? Contact Me!</h2></div>
      <form action="submit" className='contact-form' onSubmit={handleSubmit}>
          {/* Name */}
          <div className='form-input-item'><input type="text" id='name' className='form-input-field' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          {/* Phone */}
          <div className='form-input-item'><input type="tel" id='phone' className='form-input-field' placeholder='Enter Your Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
          {/* Email */}
          <div className='form-input-item'><input type="email" id='email' className='form-input-field' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          {/* Message */}
          <div className='form-input-item'><textarea id="message" className='form-input-field' placeholder="Enter Your Message" maxLength={200} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
          </div>

          <button type="submit" className='submit-btn'>Submit Request</button>
      </form>
    </div>   
  )
}

export const InquiryFilter = ({onFilterChange}) => {
  /**
   * The filter component for an inquiry in the dashboard.
   * Filters:
   *  - User Name
   *  - Inquiry Date
   */
  const [username, setUsername] = useState('')
  const [inqDate, setInqDate] = useState('');

  // Whenever these are changed by the user update the search
  useEffect(() => {
    onFilterChange({
      'username': username,
      'inq_date': inqDate
    })
  }, [username, inqDate])

  return (
    <div className='filter-container'>
      <input type="text" placeholder='User Name' onChange={(e) => setUsername(e.target.value)}/>
      <input type="date" onChange={(e) => setInqDate(e.target.value)}/>
    </div>
  )
}