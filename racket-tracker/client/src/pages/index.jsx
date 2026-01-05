import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css';

const Home = () => {

    return (
       <div className='page-content'>
            <div className='landing'>
                <h1>Racket Tracker</h1>
            </div>
            <div className='about-container'>
                <div className='about-website'>
                    <h2>About Racket Tracker</h2>
                </div>
                <div className='about-me'>
                    <h2>About me</h2>
                </div>
            </div>
            <div className='service-container'>
                <h2>Request a service</h2>
            </div>
            <div className='footer'>
                <p>footer</p>
            </div>
       </div>
    )
}

export default Home;