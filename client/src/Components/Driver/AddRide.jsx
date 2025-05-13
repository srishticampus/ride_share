import React, { useState, useEffect } from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import { Link, useNavigate } from 'react-router-dom';
import service from '../../Services/apiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import { ClickAwayListener } from '@mui/material';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';

const AddRide = () => {
  const navigate = useNavigate();
  const currentDriver = JSON.parse(localStorage.getItem("driverData"));
  const [minDate, setMinDate] = useState('');
  const [minTime, setMinTime] = useState('');
  const [errors, setErrors] = useState({});
  const [hasVehicle, setHasVehicle] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  
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

  useEffect(() => {
    if (currentDriver?.vehicleId) {
      setHasVehicle(true);
    } else {
      setHasVehicle(false);
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    
    // Set minimum time to current time if date is today
    if (formData.rideDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setMinTime(`${hours}:${minutes}`);
    } else {
      setMinTime('00:00');
    }
  }, [formData.rideDate]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    if (!formData.origin) newErrors.origin = 'Pickup location is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    
    // Date validation
    if (!formData.rideDate) {
      newErrors.rideDate = 'Ride date is required';
    } else {
      const selectedDate = new Date(formData.rideDate);
      if (selectedDate < new Date(today)) {
        newErrors.rideDate = 'Cannot select past dates';
      }
    }
    
    // Time validation
    if (!formData.rideTime) {
      newErrors.rideTime = 'Ride time is required';
    } else if (formData.rideDate === today) {
      const [hours, minutes] = formData.rideTime.split(':').map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes);
      
      if (selectedTime < now) {
        newErrors.rideTime = 'Cannot select past time for today';
      }
    }
    
    // Available seats validation
    if (!formData.availableSeats || formData.availableSeats < 1) {
      newErrors.availableSeats = 'Must have at least 1 seat';
    }
    
    // Price validation
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasVehicle) {
      toast.error('You must add vehicle details before creating a ride');
      navigate('/driver-Add-Vehicle'); 
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      const rideData = {
        VehicleId: currentDriver.vehicleId,
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
      
      toast.success('Ride created successfully!');
      
      // Reset form
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

    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error(error.response?.data?.message || 'Failed to create ride');
    } 
  };

  return (
    <div className="payment-container">
      <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />

      {showProfileCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{ position: "absolute", top: "40px", right: "20px" }}>
            <DriverViewProfile onEditClick={onEditClick} driver={currentDriver} />
          </div>
        </ClickAwayListener>
      )}

      {showProfileEditCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
          <div style={{ 
            position: "absolute", 
            top: "10vh", 
            left: "250px", 
            backgroundColor: "white", 
            zIndex: "5", 
            borderRadius: "25px" 
          }}>
            <DriverEditProfile
              setShowProfileEditCard={setShowProfileEditCard}
              currentDriver={currentDriver}
              setCurrentDriver={(updatedDriver) => {
                localStorage.setItem("driverData", JSON.stringify(updatedDriver));
              }}
            />
          </div>
        </ClickAwayListener>
      )}

      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD RIDE</h1>
          
         

          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="origin">Pick Up Location*</label>
                <input
                  className={`form-input ${errors.origin ? 'is-invalid' : ''}`}
                  id="origin"
                  name="origin"
                  placeholder="Enter pick-up address"
                  type="text"
                  value={formData.origin}
                  onChange={handleChange}
                />
                {errors.origin && <div className="invalid-feedback">{errors.origin}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="destination">Destination*</label>
                <input
                  className={`form-input ${errors.destination ? 'is-invalid' : ''}`}
                  id="destination"
                  name="destination"
                  placeholder="Enter destination address"
                  type="text"
                  value={formData.destination}
                  onChange={handleChange}
                />
                {errors.destination && <div className="invalid-feedback">{errors.destination}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideDate">Ride Date*</label>
                <input
                  className={`form-input ${errors.rideDate ? 'is-invalid' : ''}`}
                  id="rideDate"
                  name="rideDate"
                  type="date"
                  min={minDate}
                  value={formData.rideDate}
                  onChange={handleChange}
                />
                {errors.rideDate && <div className="invalid-feedback">{errors.rideDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideTime">Ride Time*</label>
                <input
                  className={`form-input ${errors.rideTime ? 'is-invalid' : ''}`}
                  id="rideTime"
                  name="rideTime"
                  type="time"
                  min={formData.rideDate === minDate ? minTime : undefined}
                  value={formData.rideTime}
                  onChange={handleChange}
                />
                {errors.rideTime && <div className="invalid-feedback">{errors.rideTime}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="availableSeats">Available Seats*</label>
                <input
                  className={`form-input ${errors.availableSeats ? 'is-invalid' : ''}`}
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  min="1"
                  max="15"
                  value={formData.availableSeats}
                  onChange={handleChange}
                />
                {errors.availableSeats && <div className="invalid-feedback">{errors.availableSeats}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (₹)*</label>
                <input
                  className={`form-input ${errors.price ? 'is-invalid' : ''}`}
                  id="price"
                  name="price"
                  placeholder="0.00"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
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
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rideDescription">Ride Description</label>
                <input
                  className="form-input"
                  id="rideDescription"
                  name="rideDescription"
                  placeholder="Vehicle type, amenities, etc."
                  type="text"
                  value={formData.rideDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="route">Preferred Route</label>
                <input
                  className="form-input"
                  id="route"
                  name="route"
                  placeholder="Highway, scenic route, etc."
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