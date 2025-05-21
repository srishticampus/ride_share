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
import apiService from '../../Services/apiService';

const AddRide = () => {
  const [currentDriver, setCurrentDriver] = useState({});
  const [minDateTime, setMinDateTime] = useState('');
  const [errors, setErrors] = useState({});
  const [hasVehicle, setHasVehicle] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    rideDateTime: '',
    availableSeats: 1,
    price: '',
    rideDescription: '',
    specialNote: '',
    route: ''
  });

  const fetchDriverData = async () => {
    try {
      const driverData = await apiService.getCurrentDriver();
      const driver = driverData.data.driver;
      setCurrentDriver(driver);
      // Update hasVehicle based on the fetched driver data
      setHasVehicle(!!driver.vehicleId);
    } catch (error) {
      console.error("Failed to load driver data:", error);
    }
  };

  useEffect(() => {
    fetchDriverData();
    
    // Set minimum datetime
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
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
    const now = new Date();
    
    if (!formData.origin) newErrors.origin = 'Pickup location is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    
    if (!formData.rideDateTime) {
      newErrors.rideDateTime = 'Ride date and time are required';
    } else {
      const selectedDateTime = new Date(formData.rideDateTime);
      if (selectedDateTime < now) {
        newErrors.rideDateTime = 'Cannot select past date and time';
      }
    }
    
    if (!formData.availableSeats || formData.availableSeats < 1) {
      newErrors.availableSeats = 'Must have at least 1 seat';
    }
    
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
    const rideDateTime = new Date(formData.rideDateTime);
    const rideDate = rideDateTime.toISOString().split('T')[0];
    
    // Format time as HH:MM (24-hour format)
    const hours = rideDateTime.getHours().toString().padStart(2, '0');
    const minutes = rideDateTime.getMinutes().toString().padStart(2, '0');
    const rideTime = `${hours}:${minutes}`;

    const rideData = {
      VehicleId: currentDriver.vehicleId,
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      rideDate: rideDate,
      rideTime: rideTime, // Now properly formatted as HH:MM
      availableSeats: parseInt(formData.availableSeats),
      price: parseFloat(formData.price), // Ensure this is a number
      rideDescription: formData.rideDescription.trim(),
      specialNote: formData.specialNote.trim(),
      route: formData.route.trim()
    };

    console.log('Submitting ride data:', rideData); // Debug log

    const response = await service.createRide(rideData);
    toast.success('Ride created successfully!');
    
    setFormData({
      origin: '',
      destination: '',
      rideDateTime: '',
      availableSeats: 1,
      price: '',
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
                setCurrentDriver(updatedDriver);
                setHasVehicle(!!updatedDriver.vehicleId);
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
              {/* Form fields remain the same as before */}
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
                <label className="form-label" htmlFor="rideDateTime">Ride Date & Time*</label>
                <input
                  className={`form-input ${errors.rideDateTime ? 'is-invalid' : ''}`}
                  id="rideDateTime"
                  name="rideDateTime"
                  type="datetime-local"
                  min={minDateTime}
                  value={formData.rideDateTime}
                  onChange={handleChange}
                />
                {errors.rideDateTime && <div className="invalid-feedback">{errors.rideDateTime}</div>}
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