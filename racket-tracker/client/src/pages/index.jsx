import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css';

const Home = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            'name':name,
            'phone': phone,
            'email': email,
            'message': message
        });

        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
    }
    
    return (
       <div className='page-content'>
            <div className='container'>
                <section className='landing'>
                    <h1>Racket Tracker</h1>
                </section>
            </div>
            <div className='container'>
                <section className='about'>
                    <div className='about-website'>
                        <h2>About Racket Tracker</h2>
                        <p>
                            This is a website I made to keep track of the orders that people make as I string their
                            rackets. I used a React frontend with a Flask backend using Flask-SQLAlchemy to handle
                            the database interactions. The database is run using the SQLAlchemy ORM to handle the 
                            queries and then uses a SQLlite database.
                        </p>
                    </div>
                    <div className='about-me'>
                        <h2>About me</h2>
                        <p>
                            I am a student at Boston University on the BU Club Tennis Team. I coach tennis and String
                            rackets. I have played throughout high school and ......
                        </p>
                    </div>
                </section>
            </div>
            <div className='container'>
                <section className='how-to'>
                    <h2>How to use the website</h2>
                    <p>How to use the website...</p>
                </section>
            </div>
            <footer>
                <div className='footer'>
                    <section className='contact'>
                        <h4>Request a service</h4>
                        <form action="submit" className='contact-form' onSubmit={handleSubmit}>
                            <label htmlFor="name" className='form-label' >Name:</label>
                            <div className='form-input-field'><input type="text" id='name' placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                            
                            <label htmlFor="phone" className='form-label' >Phone Number:</label>
                            <div className='form-input-field'><input type="tel" id='phone' placeholder='Your Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
                            </div>
                            <label htmlFor="email" className='form-label' >Email:</label>
                            <div className='form-input-field'><input type="email" id='email' placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <label htmlFor="message" className='form-label' >Message:</label>
                            <div className='form-input-field'><textarea id="message" placeholder="Your Message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                            </div>
                            <button type="submit" className='submit-btn'>Submit Request</button>
                        </form>
                    </section>
                    <section className='links'>
                        <h4>Links</h4>
                    </section>
                </div>
            </footer>
       </div>
    )
}

export default Home;