import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import RiderNav from './RiderNav';
import { toast  } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import service from '../../Services/apiService';
import { ClickAwayListener } from '@mui/material';
import RiderViewProfile from './RiderViewProfile';
import RiderEditProfile from './RiderEditProfile';

const RiderComplaints = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("riderToken");
  const riderId = localStorage.getItem("riderId");
  const fileInputRef = useRef(null);
  
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reportedBy: riderId,
    driverName: '',
    driverData: '',
    subject: '',
    incidentDate: '',
    priorityLevel: '',
    description: '',
    attachment: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await service.getCurrentUser();
        localStorage.setItem("UserInfo", JSON.stringify(userData.data.user));
        setCurrentUser(userData.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrentUser();
  }, []);

  const onAvatarClick = () => {
    setShowProfileCard(prev => !prev);
    if (!showProfileCard) {
      setShowProfileEditCard(false);
    }
  };

  const onEditClick = () => {
    setShowProfileEditCard(true);
    setShowProfileCard(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.driverData) newErrors.driverData = 'Driver ID is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    if (!formData.priorityLevel) newErrors.priorityLevel = 'Priority level is required';
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'attachment') {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // toast.error('Please fill all required fields');
      alert('Please fill all required fields')
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = new FormData();
      payload.append('reportedBy', formData.reportedBy); 
      payload.append('driverName', formData.driverName);
      payload.append('driverData', formData.driverData);
      payload.append('subject', formData.subject);
      payload.append('incidentDate', formData.incidentDate);
      payload.append('priorityLevel', formData.priorityLevel);
      payload.append('description', formData.description);
      if (formData.attachment) {
        payload.append('attachment', formData.attachment);
      }
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      await service.createDispute(payload, token);
      // toast.success('Complaint submitted successfully!');
      alert("Complaint submitted successfully!")
      
      // Reset form
      setFormData({
        reportedBy: riderId,
        driverName: '',
        driverData: '',
        subject: '',
        incidentDate: '',
        priorityLevel: '',
        description: '',
        attachment: null,
      });
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      // toast.error(error.response?.data?.message || error.message || 'Submission failed');
      alert(error.response?.data?.message || error.message || 'Submission failed')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="payment-container">
      {/* <ToastContainer /> */}
      <RiderNav onAvatarClick={onAvatarClick} />
      
      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD COMPLAINT</h1>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="complaint-form-grid">
              <div className="complaint-left-column">
                <div className="form-group">
                  <label htmlFor="subject">Subject / Title *</label>
                  <input
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter complaint subject"
                    className={`form-input ${errors.subject ? 'error' : ''}`}
                  />
                  {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="incidentDate">Date of Incident *</label>
                  <div className="date-input-wrapper">
                    <input
                      id="incidentDate"
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.incidentDate}
                      onChange={handleChange}
                      className={`form-input ${errors.incidentDate ? 'error' : ''}`}
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                  {errors.incidentDate && <span className="error-message">{errors.incidentDate}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="priorityLevel">Priority Level *</label>
                  <select
                    id="priorityLevel"
                    value={formData.priorityLevel}
                    onChange={handleChange}
                    className={`form-input ${errors.priorityLevel ? 'error' : ''}`}
                  >
                    <option value="">Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {errors.priorityLevel && <span className="error-message">{errors.priorityLevel}</span>}
                </div>
              </div>

              <div className="complaint-right-column">
                <div className="form-group">
                  <label htmlFor="driverId">Driver ID *</label>
                  <input
                    id="driverData"
                    value={formData.driverData}
                    onChange={handleChange}
                    placeholder="Enter driver ID"
                    className={`form-input ${errors.driverData ? 'error' : ''}`}
                  />
                  {errors.driverData && <span className="error-message">{errors.driverData}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="attachment">Attachment (Optional)</label>
                  <input
                    id="attachment"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleChange}
                    className="form-input"
                    ref={fileInputRef}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your complaint"
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
              </div>
            </div>

            <div className="submit-container">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </section>
      </main>

      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{ position: "absolute", top: "40px", right: "20px", zIndex: 1000 }}>
            <RiderViewProfile
              onEditClick={onEditClick}
              currentUser={currentUser}
            />
          </div>
        </ClickAwayListener>
      )}
      {showProfileEditCard && (
        <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
          <div style={{ 
            position: "absolute", 
            top: "10vh", 
            left: "50%", 
            transform: "translateX(-50%)",
            backgroundColor: "white", 
            zIndex: 1000, 
            borderRadius: "25px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            <RiderEditProfile
              setShowProfileEditCard={setShowProfileEditCard}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>
        </ClickAwayListener>
      )}

      <Footer />
    </div>
  );
};

export default RiderComplaints;