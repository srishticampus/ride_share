import React from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import RiderNav from './RiderNav';
import Footer from '../Common/Footer';


const RiderPayment = () => {
  return (
    <div className="payment-container">
      <RiderNav />

      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">PAYMENT</h1>
          <form className="payment-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="paymentId">Payment ID</label>
                <input
                  className="form-input"
                  id="paymentId"
                  name="paymentId"
                  placeholder="Enter the Payment ID"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentStatus">Payment Status</label>
                <input
                  className="form-input"
                  id="paymentStatus"
                  name="paymentStatus"
                  placeholder="Enter the Driver ID"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideId">Ride ID</label>
                <input
                  className="form-input"
                  id="rideId"
                  name="rideId"
                  placeholder="Enter the Ride ID"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="invoiceNumber">Invoice Number</label>
                <input
                  className="form-input"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  placeholder="Enter the Invoice Number"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="riderId">Rider ID</label>
                <input
                  className="form-input"
                  id="riderId"
                  name="riderId"
                  placeholder="Enter the Rider ID"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentNote">Payment Note (Optional)</label>
                <input
                  className="form-input"
                  id="paymentNote"
                  name="paymentNote"
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
                  placeholder="Enter the Driver ID"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentAmount">Payment Amount</label>
                <input
                  className="form-input"
                  id="paymentAmount"
                  name="paymentAmount"
                  placeholder="Enter the Amount"
                  type="text"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="transactionDateTime">Transaction Date & Time</label>
                <div className="date-input-container">
                  <input
                    className="form-input date-input"
                    id="transactionDateTime"
                    name="transactionDateTime"
                    placeholder="Choose the Date & Time"
                    type="datetime-local"
                  />
                  <FaCalendarAlt className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modeOfPayment">Mode of Payment</label>
                <select className="form-input" id="modeOfPayment" name="modeOfPayment">
                  <option disabled selected>Choose the Mode of Payment</option>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Online Payment</option>
                </select>
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

export default RiderPayment;