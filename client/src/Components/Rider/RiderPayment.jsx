import React, { useState } from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import RiderNav from './RiderNav';
import Footer from '../Common/Footer';
import Rating from '@mui/material/Rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const RiderPayment = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    paymentId: '',
    paymentStatus: '',
    rideId: '',
    invoiceNumber: '',
    riderId: '',
    paymentNote: '',
    driverId: '',
    paymentAmount: '',
    transactionDateTime: '',
    modeOfPayment: ''
  });
  const [review, setReview] = useState({
    comment: '',
    rating: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setReview(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = (e) => {
    alert("Payment Send Successfully")
    e.preventDefault();
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setReview({
      comment: '',
      rating: 0
    });
  };

  const submitReview = () => {
    console.log('Review submitted:', review);
    alert('Review submitted')
    closeDialog();
  };

  return (
    <div className="payment-container">
      <RiderNav />

      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">PAYMENT DETAILS</h1>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="paymentId">Payment ID</label>
                <input
                  className="form-input"
                  id="paymentId"
                  name="paymentId"
                  value={formData.paymentId}
                  onChange={handleInputChange}
                  placeholder="Enter the Payment ID"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentStatus">Payment Status</label>
                <input
                  className="form-input"
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  placeholder="Enter the Payment Status"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideId">Ride ID</label>
                <input
                  className="form-input"
                  id="rideId"
                  name="rideId"
                  value={formData.rideId}
                  onChange={handleInputChange}
                  placeholder="Enter the Ride ID"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="invoiceNumber">Invoice Number</label>
                <input
                  className="form-input"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  placeholder="Enter the Invoice Number"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="riderId">Rider ID</label>
                <input
                  className="form-input"
                  id="riderId"
                  name="riderId"
                  value={formData.riderId}
                  onChange={handleInputChange}
                  placeholder="Enter the Rider ID"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentNote">Payment Note (Optional)</label>
                <input
                  className="form-input"
                  id="paymentNote"
                  name="paymentNote"
                  value={formData.paymentNote}
                  onChange={handleInputChange}
                  placeholder="Enter the Payment Note"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="driverId">Driver ID</label>
                <input
                  className="form-input"
                  id="driverId"
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  placeholder="Enter the Driver ID"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentAmount">Payment Amount</label>
                <input
                  className="form-input"
                  id="paymentAmount"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleInputChange}
                  placeholder="Enter the Amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="transactionDateTime">Transaction Date & Time</label>
                <div className="date-input-container">
                  <input
                    className="form-input date-input"
                    id="transactionDateTime"
                    name="transactionDateTime"
                    value={formData.transactionDateTime}
                    onChange={handleInputChange}
                    type="datetime-local"
                    required
                  />
                  <FaCalendarAlt className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modeOfPayment">Mode of Payment</label>
                <select
                  className="form-input"
                  id="modeOfPayment"
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Choose the Mode of Payment</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>
            </div>

            <div className="submit-container">
              <button className="submit-btn" type="submit">SUBMIT PAYMENT</button>
            </div>
          </form>
        </section>
      </main>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h3>REVIEW</h3>
            </div>
            <div className="dialog-body">
             

              <div className="review-section">
                <div className="form-group">
                  <label className="form-label" htmlFor="comment">Comment</label>
                  <TextareaAutosize
                    id="comment"
                    name="comment"
                    value={review.comment}
                    onChange={handleReviewChange}
                    minRows={1}
                    className="review-textarea"
                    placeholder="Share your experience..."
                  />               
                   </div>
                <div className="rating-group">
                  <label className="rating-label">Rate Us!</label>
                  <Rating
                    name="rating"
                    value={review.rating}
                    onChange={handleRatingChange}
                    precision={0.5}
                    size="large"
                  />
                </div>
              </div>
            </div>
            <div className="dialog-footer">
             
              <button className="dialog-button primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RiderPayment;