import React from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import RiderNav from './RiderNav';

const AddRiderComplaints = () => {
  return (
    <div className="payment-container">
<RiderNav/>
      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD COMPLAINT</h1>
          <form className="payment-form">
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
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="priorityLevel">Priority Level</label>
                  <select className="form-input" id="priorityLevel" name="priorityLevel">
                    <option disabled selected value="">Select priority level</option>
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
                  />
                </div>
              </div>
            </div>

            <div className="submit-container">
              <button className="submit-btn" type="submit">SUBMIT</button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AddRiderComplaints;