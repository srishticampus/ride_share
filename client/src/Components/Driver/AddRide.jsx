import React, { useState } from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import service from '../../Services/apiService'

const AddRide = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    rideDate: '',
    rideTime: '',
    availableSeats: 1,
    price: '',
    status: 'pending',
    rideDescription: '',
    specialNote: '',
    route: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const rideData = {
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        rideDate: formData.rideDate,
        rideTime: formData.rideTime,
        availableSeats: parseInt(formData.availableSeats),
        price: parseFloat(formData.price),
        status: formData.status,
        rideDescription: formData.rideDescription.trim(),
        specialNote: formData.specialNote.trim(),
        route: formData.route.trim()
      };

      const response = await service.createRide(rideData);
      
      console.log('Ride created successfully:', response.data);
      
      setFormData({
        origin: '',
        destination: '',
        rideDate: '',
        rideTime: '',
        availableSeats: 1,
        price: '',
        status: 'pending',
        rideDescription: '',
        specialNote: '',
        route: ''
      });

      alert('Ride added successfully!');
    } catch (error) {
      console.error('Error creating ride:', error);
    } 
  };
  return (
    <div className="payment-container">
      <DriverNav />

      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD RIDE</h1>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="origin">Pick Up Location</label>
                <input
                  className="form-input"
                  id="origin"
                  name="origin"
                  placeholder="Enter pick-up address"
                  type="text"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="destination">Destination</label>
                <input
                  className="form-input"
                  id="destination"
                  name="destination"
                  placeholder="Enter destination address"
                  type="text"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideDate">Ride Date</label>
                <input
                  className="form-input"
                  id="rideDate"
                  name="rideDate"
                  type="date"
                  value={formData.rideDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideTime">Ride Time</label>
                <input
                  className="form-input"
                  id="rideTime"
                  name="rideTime"
                  type="time"
                  value={formData.rideTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="availableSeats">Available Seats</label>
                <input
                  className="form-input"
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  min="1"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price</label>
                <input
                  className="form-input"
                  id="price"
                  name="price"
                  placeholder="Enter fare amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">Ride Status</label>
                <select
                  className="form-input"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="available">Available</option>
                  <option value="accepted">Accepted</option>
                  <option value="started">Started</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideDescription">Ride Description (Optional)</label>
                <input
                  className="form-input"
                  id="rideDescription"
                  name="rideDescription"
                  placeholder="Enter ride description (e.g., vehicle type)"
                  type="text"
                  value={formData.rideDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="route">Route (Optional)</label>
                <input
                  className="form-input"
                  id="route"
                  name="route"
                  placeholder="Enter route details"
                  type="text"
                  value={formData.route}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="specialNote">Special Note (Optional)</label>
                <input
                  className="form-input"
                  id="specialNote"
                  name="specialNote"
                  placeholder="Enter any special instructions"
                  type="text"
                  value={formData.specialNote}
                  onChange={handleChange}
                />
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

export default AddRide;