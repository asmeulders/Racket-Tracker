import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css';

import { Footer } from '../components/footer/Footer';

import buIcon from '../assets/bu-icon.svg';

const Home = () => {
    
    return (
       <div className='page-content'>
            <section className='landing'>
                <h1>Racket Tracker</h1>
            </section>
            <div className='container'>
                <section className='about-content'>
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
                    <div className='experience'>
                        <div className='experience-item bu-item'>
                            <div className='experience-content'>
                                <h6 className='experience-date'>January 2024-Present</h6>
                                <h3>Tennis Coach</h3>
                                <h4>BU Physical Educaton, Recreation, and Dance</h4>
                                <ul className='responsibility-list'>
                                    <li className='responsibility-item'>
                                        Coached groups of 4-8 children or adults from all levels 
                                        to play tennis recreationally and competitively
                                    </li>
                                    <li className='responsibility-item'>
                                        Called on personal competitive experience giving specific 
                                        feedback to students to improve their understanding of the sport                                
                                    </li>
                                    <li className='responsibility-item'>
                                        Created lesson plans for small and large groups to encourage 
                                        proper technique, strategy, and exercise
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='experience-item kempton-item'>
                            <div className='experience-content'>
                                <h6 className='experience-date'>May 2025 - December 2025</h6>
                                <h3>Sales Associate</h3>
                                <h4>Kempton Pro Shop</h4>
                                <ul className='responsibility-list'>
                                    <li className='responsibility-item'>
                                        Strung tennis rackets for day-to-day customers and the 
                                        Harvard’s Men’s and Women’s varsity tennis teams
                                    </li>
                                    <li className='responsibility-item'>
                                        Attended to customers in store to answer questions, provide recommendations, 
                                        and perform stringing, regripping, and customization                                
                                    </li>
                                    <li className='responsibility-item'>
                                        Maintained a high standard of quality while stringing meanwhile 
                                        providing quick and efficient service
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='experience-item ctc-item'>
                            <div className='experience-content'>
                                <h6 className='experience-date'> July 2025 - August 2025</h6>
                                <h3>Tennis Coach</h3>
                                <h4>Cambridge Tennis Club</h4>
                                <ul className='responsibility-list'>
                                    <li className='responsibility-item'>
                                        Facilitated activities and games with groups of up 25 middle school
                                        aged campers across 3 courts
                                    </li>
                                    <li className='responsibility-item'>
                                        Designed lesson plans to introduce racquet skills to beginners and 
                                        led fellow coaches to instruct the students                 
                                    </li>
                                    <li className='responsibility-item'>
                                        Instructed group lessons for adults with a focus on doubles competitive
                                        play
                                    </li>
                                    <li className='responsibility-item'>
                                        Coached players in a one-on-one setting to provide more detailed
                                        feedback about technique
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className='container'>
                <section className='how-to'>
                    <h2>How to use the website</h2>
                    <p>How to use the website...</p>
                </section>
            </div>
       </div>
    )
}

export default Home;