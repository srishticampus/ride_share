import React from 'react';
import { Link } from 'react-router-dom';
import navImage from '../../Assets/LandingTOp.png'; 
import '../Style/LandingPage.css'; 
import Footer from './Footer';

function ContactUs() {
  return (
    <div className="contact-page">
      <div className='landing-nav'>
        <img src={navImage} alt="Navigation header" className='landing-nav-image' />
      </div>
      <div className='nav-links'>
        <div className="links-container">
          <Link to="/">HOME</Link>
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>
        </div>
      </div>

      <div className="contact-container">
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