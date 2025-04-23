import React from 'react';
import { Link } from 'react-router-dom';
import navImage from '../../Assets/LandingTOP.png'; 
import '../Style/LandingPage.css'; 
import Footer from './Footer';
import LandindNav from './LandingNav';

function ContactUs() {
  return (
    <div className="contact-page">
    <LandindNav/>

      <div className="contact-container" style={{marginTop:"100px"}}>
        <h1>Contact Us</h1>
        <form className="contact-form">
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name" style={{ color: '#F1B92E' }}>Name</label>
              <input 
                type="text" 
                id="name" 
                className="form-input" 
                style={{ borderColor: '#F1B92E' }} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="email" style={{ color: '#F1B92E' }}>Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                style={{ borderColor: '#F1B92E' }} 
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="message" style={{ color: '#F1B92E' }}>Message</label>
            <textarea 
              id="message" 
              className="form-textarea" 
              style={{ borderColor: '#F1B92E' }} 
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
      <Footer/>
    </div>
  );
}

export default ContactUs;