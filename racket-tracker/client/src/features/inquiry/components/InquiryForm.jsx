import { useState } from 'react';

import { useInquiry } from '../useInquiry';

export const InquiryForm = () => {
    const { createInquiry } = useInquiry();
    const [fields, setFields] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createInquiry({
            name: fields.name, 
            phone: fields.phone, 
            email: fields.email, 
            message: fields.message 
        });
        setFields({
            name: '',
            phone: '',
            email: '',
            message: ''
        });
        // onInquiryCreated();
    }

    return(
        <div className='contact-form-container'>
            <div className='form-header'><h2>Need a racket strung? Contact Me!</h2></div>
            <form action="submit" className='contact-form' onSubmit={handleSubmit}>
                {/* Name */}
                <div className='form-input-item'><input type="text" id='name' className='form-input-field' placeholder='Enter Your Name' value={fields.name} onChange={(e) => setFields(prev => ({...prev, name: e.target.value}))} required/>
                </div>
                {/* Phone */}
                <div className='form-input-item'><input type="tel" id='phone' className='form-input-field' placeholder='Enter Your Phone Number' value={fields.phone} onChange={(e) => setFields(prev => ({...prev, phone: e.target.value}))} />
                </div>
                {/* Email */}
                <div className='form-input-item'><input type="email" id='email' className='form-input-field' placeholder='Enter Your Email' value={fields.email} onChange={(e) => setFields(prev => ({...prev, email: e.target.value}))} required/>
                </div>
                {/* Message */}
                <div className='form-input-item'><textarea id="message" className='form-input-field' placeholder="Enter Your Message" maxLength={300} value={fields.message} onChange={(e) => setFields(prev => ({...prev, message: e.target.value}))} required></textarea>
                </div>

                <button type="submit" className='submit-btn'>Submit Request</button>
            </form>
        </div>   
    )
}