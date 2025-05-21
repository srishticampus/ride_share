import React, { useState } from 'react';
import axios from 'axios';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import RiderNav from './RiderNav';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import service from '../../Services/apiService'
const RiderComplaints = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("riderToken");
  const riderId = localStorage.getItem("riderId");
console.log(riderId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reportedBy:riderId,
    driverName: '',
    driverData: '',
    subject: '',
    incidentDate: '',
    priorityLevel: '',
    description: '',
    attachment: null,
  });
  const [errors, setErrors] = useState({});

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
    toast.error('Please fill all required fields');
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
    console.log(token);
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    await service.createDispute(payload, token);
      toast.success('Complaint submitted successfully!');
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error.response?.data?.message || error.message || 'Submission failed');
  } finally {
    setIsSubmitting(false);
  }
};  return (
    <div className="payment-container">
      <RiderNav />
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
                {/* <div className="form-group">
                  <label htmlFor="driverName">Driver Name (Optional)</label>
                  <input
                    id="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="Enter driver name"
                    className="form-input"
                  />
                </div> */}
              </div>

              <div className="complaint-right-column">
                <div className="form-group">
                  <label htmlFor="driverId">Driver ID *</label>
                  <input
                    id="driverData"
                    value={formData.driverData}
                    onChange={handleChange}
                    placeholder="Enter driver ID"
                    className={`form-input ${errors.driverId ? 'error' : ''}`}
                  />
                  {errors.driverId && <span className="error-message">{errors.driverId}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="attachment">Attachment (Optional)</label>
                  <input
                    id="attachment"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleChange}
                    className="form-input"
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
      <Footer />
    </div>
  );
};

export default RiderComplaints;
