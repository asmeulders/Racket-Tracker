import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css';

import { Footer } from './components/footer/Footer';

import buIcon from '../assets/bu-icon.svg';

const Home = () => {
    
    return (
       <div className='page-content'>
            <section className='landing'>
                <h1>Racket Tracker</h1>
            </section>
            <div className='container'>
                <div id='about' className='about-section'>
                    <h1>About</h1>
                    <div className='about-item'>
                        <div className='about-title'>
                            <h2>About me</h2>
                        </div>
                        <div className='about-text'>
                            <p>
                                I am a student at <a href="https://www.bu.edu/" target='_blank' rel="noreferrer">Boston University</a> with a major in 
                                Computer Science and a minor in Physics in the class of 2027. I play on the 
                                <a href="https://www.instagram.com/bostonuclubtennis/?hl=en" target='_blank' rel="noreferrer"> BU Club Tennis Team</a> playing in 
                                sectionals for two years in a row and I currently serve as the treasurer and p
                                reviously I was one of the captains. I coach tennis  at BU in the Track and 
                                Tennis Center and string racquets on my own! I coached tennis over the summer 
                                of 2025 at the Cambridge Tennis Club for their outreach clinic and I used to work 
                                at Kempton Pro Shop in Watertown, MA. There, I strung an average of 6 racquets 
                                every four hours while attending to customers giving advice and selling merchandise. 
                                Now I string on my own and decided to make this website! I have played throughout 
                                high school where we had great success in our section and I was captain and MVP 
                                my senior year. My favorite player is Roger Federer and he inspires me to play
                                with an aggressive serve and volley playstyle. I was so fortunate to attend 
                                the <a href='https://greatbasetennis.com/' target='_blank' rel="noreferrer">Great Base Tennis Academy</a> where
                                I learned so much about the way I know coach and play tennis. Without this
                                experience I would not be the same person I am today because it motivated me to 
                                dedicate myself to my training and to tennis in a way I had never done before.
                            </p>
                        </div>
                    </div>
                    <div className='about-item'>
                        <div className='about-title'>
                            <h2>About Racket Tracker</h2>
                        </div>
                        <div className='about-text'>
                            <p>
                            As I string rackets for people I used an Excel sheet to manage transactions and order
                            histories but I was inspired to create my own website to handle my business since
                            I had the skills and the tools to do so. I wanted to create an all in one place to
                            manage my customers, orders, rackets, and strings so I could focus more on stringing
                            the rackets than dealing with the transactions. Racket Tracker was developed using React 
                            for the frontend with a Flask backend using Flask-SQLAlchemy to handle the database 
                            interactions. The database is run using the SQLAlchemy ORM to handle the queries 
                            to a SQLlite database. 
                        </p>
                        </div>
                    </div>
                </div>
                <div id='experience' className='experience'>
                    <h1>Professional Experience</h1>
                    <div className='experience-item bu-item'>
                        <div className='experience-content'>
                            <h6 className='experience-date'>January 2024-Present</h6>
                            <h3>Tennis Coach</h3>
                            <h4><a href="https://www.bu.edu/academics/fitrec/" target='_blank' rel="noreferrer">Boson University Physical Educaton, Recreation, and Dance</a></h4>
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
                            <h4><a href="https://www.kemptonproshops.com/" target='_blank' rel="noreferrer">Kempton Pro Shop</a></h4>
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
                            <h4><a href="https://cambridgetennis.org/" target='_blank' rel="noreferrer">Cambridge Tennis Club</a></h4>
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