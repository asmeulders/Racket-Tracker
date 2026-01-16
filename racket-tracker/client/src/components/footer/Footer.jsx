import React from "react";
import "./Footer.css";

import { InquiryForm } from "../inquiry/Inquiry";

export const Footer = () => {
    return (
        <footer>
            <div className='footer'>
                <section className='contact'>
                    <InquiryForm />
                </section>
                <section className='quick-links-container'>
                    <h4>Quick Links</h4>
                    <ul className="quick-links">
                        <li className="quick-link-item"><a href="#about">About</a></li>
                        <li className="quick-link-item"><a href="#experience">Experience</a></li>
                        <li className="quick-link-item"><a href="/login">Log In</a></li>
                        <li className="quick-link-item"><a href="https://github.com/asmeulders" target="_blank" rel="noreferrer">Github</a></li>
                        <li className="quick-link-item"><a href="https://linkedin.com/in/asmeulders" target="_blank" rel="noreferrer">LinkedIn</a></li>
                    </ul>
                </section>
            </div>
        </footer>
    );
};