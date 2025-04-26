import React, { useState } from 'react';
import axios from 'axios';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import { useNavigate } from 'react-router-dom';

const AddComplaints = () => {
  const [formData, setFormData] = useState({
    complaintSubject: '',
    incidentDate: '',
    priorityLevel: '',
    complaintDescription: '',
    complaintAttachment: null
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.complaintSubject);
      formDataToSend.append('incidentDate', formData.incidentDate);
      formDataToSend.append('priorityLevel', formData.priorityLevel);
      formDataToSend.append('description', formData.complaintDescription);
      if (formData.complaintAttachment) {
        formDataToSend.append('attachment', formData.complaintAttachment);
      }
      const driverId = localStorage.getItem('driverId');
      formDataToSend.append('driverId', driverId);

      const response = await axios.post(
        'http://localhost:4052/ride_share_api/driver-complaints/complaints',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        navigate('/driver/complaints/confirmation');
      } else {
        setError(response.data.message || 'Failed to submit complaint');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="payment-container">
      <DriverNav />

      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD COMPLAINT</h1>
          {error && <div className="error-message">{error}</div>}
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="complaint-form-grid">
              {/* LEFT COLUMN */}
              <div className="complaint-left-column">
                <div className="form-group">
                  <label className="form-label" htmlFor="complaintSubject">Subject / Title</label>
                  <input
                    className="form-input"
                    id="complaintSubject"
                    name="complaintSubject"
                    placeholder="Enter complaint subject"
                    type="text"
                    value={formData.complaintSubject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="incidentDate">Date of Incident</label>
                  <div className="date-input-wrapper">
                    <input
                      className="form-input"
                      id="incidentDate"
                      name="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={handleChange}
                      required
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="priorityLevel">Priority Level</label>
                  <select 
                    className="form-input" 
                    id="priorityLevel" 
                    name="priorityLevel"
                    value={formData.priorityLevel}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">Select priority level</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="complaint-right-column">
                <div className="form-group">
                  <label className="form-label" htmlFor="complaintAttachment">Attachment</label>
                  <input
                    className="form-input"
                    id="complaintAttachment"
                    name="complaintAttachment"
                    type="file"
                    onChange={handleChange}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>

                <div className="form-group complaint-description-group">
                  <label className="form-label" htmlFor="complaintDescription">Description</label>
                  <textarea
                    className="form-textarea"
                    id="complaintDescription"
                    name="complaintDescription"
                    placeholder="Describe your complaint in detail"
                    rows="5"
                    value={formData.complaintDescription}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="submit-container">
              <button 
                className="submit-btn" 
                type="submit"
                disabled={isSubmitting}
              >
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

export default AddComplaints;