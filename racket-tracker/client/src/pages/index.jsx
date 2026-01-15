import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css';

import { InquiryForm } from '../components/inquiry/Inquiry';

const Home = () => {
    
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
                        <InquiryForm />
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