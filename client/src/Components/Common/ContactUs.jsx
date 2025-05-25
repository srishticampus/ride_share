import React, { useState } from 'react';
import apiService from '../../Services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/LandingPage.css';
import Footer from './Footer';
import LandindNav from './LandingNav';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiService.createContact(formData);
      
      if (response.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <LandindNav/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "70px" }}
      />

      <div className="contact-container" style={{marginTop:"100px"}}>
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name" style={{ color: '#F1B92E' }}>Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                className="form-input" 
                style={{ borderColor: '#F1B92E' }}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email" style={{ color: '#F1B92E' }}>Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                style={{ borderColor: '#F1B92E' }}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="message" style={{ color: '#F1B92E' }}>Message</label>
            <textarea 
              id="message" 
              name="message"
              className="form-textarea" 
              style={{ borderColor: '#F1B92E' }}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Sending...
              </>
            ) : 'Send Message'}
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
}

export default ContactUs;