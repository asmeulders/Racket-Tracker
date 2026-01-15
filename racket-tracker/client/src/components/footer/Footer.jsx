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
                <section className='links'>
                    <h4>Links</h4>
                </section>
            </div>
        </footer>
    );
};