import { useState } from 'react';

import { useInquiry } from '../useInquiry';

export const InquiryForm = () => {
    const { createInquiry } = useInquiry();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createInquiry({ name, phone, email, message });
        
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
        // onInquiryCreated();
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