import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/RiderPayment.css';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import service from '../../Services/apiService';
import { toast , ToastContainer } from 'react-toastify';
import { ClickAwayListener } from '@mui/material';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';

const AddVehicle = () => {
  const currentDriver = JSON.parse(localStorage.getItem("driverData"));
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentDriverState, setCurrentDriverState] = useState(currentDriver || {});

  const [formData, setFormData] = useState({
    vehicleRegistrationNo: currentDriver?.vehicleRegNumber || '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleType: '',
    vehicleCapacity: '',
    vehicleFuelType: '',
    driverId: currentDriver?._id || '',
    insuranceStatus: false
  });

  const [errors, setErrors] = useState({});

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
    if (currentDriver?._id) {
      setFormData(prev => ({
        ...prev,
        driverId: currentDriver._id,
        vehicleRegistrationNo: currentDriver.vehicleRegNumber || ''
      }));
    }
  }, []);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'vehicleYear':
        if (!/^\d{4}$/.test(value)) {
          error = 'Please enter a valid 4-digit year';
        } else if (parseInt(value) < 1900 || parseInt(value) > new Date().getFullYear()) {
          error = `Year must be between 1900 and ${new Date().getFullYear()}`;
        }
        break;
      case 'vehicleColor':
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Color should contain only letters';
        }
        break;
      case 'vehicleCapacity':
        if (!/^\d+$/.test(value)) {
          error = 'Capacity must be a number';
        } else if (parseInt(value) < 1) {
          error = 'Capacity must be at least 1';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFormData(prev => ({
      ...prev,
      [name]: name === 'insuranceStatus' ? value === 'active' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    const submissionData = {
      ...formData,
      vehicleYear: Number(formData.vehicleYear),
      vehicleCapacity: Number(formData.vehicleCapacity),
      insuranceStatus: formData.insuranceStatus === 'active'
    };

    try {
      console.log('Submitting:', submissionData);
      await service.registerVehicle(submissionData);
      toast.success('Vehicle added successfully!');
      setFormData(prev => ({
        ...prev,
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        vehicleCapacity: ''
      }));
    } catch (error) {
      console.error('Error:', error);
      if(error.message == "Vehicle with this registration number already exists"){
        toast.error("Vehicle Already Add Vehicle")
      }
      else{
      toast.error(error.message || 'Failed to add vehicle');
      }
    }
  };

  return (
    <div className="payment-container">
      <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriverState} />
<ToastContainer/>
      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD VEHICLE</h1>
          
          {showProfileCard && currentDriverState && (
            <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
              <div style={{ position: "absolute", top: "40px", right: "20px" }}>
                <DriverViewProfile onEditClick={onEditClick} driver={currentDriverState} />
              </div>
            </ClickAwayListener>
          )}

          {showProfileEditCard && currentDriverState && (
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
                  currentDriver={currentDriverState}
                  setCurrentDriver={setCurrentDriverState}
                />
              </div>
            </ClickAwayListener>
          )}

          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Column */}
              <div className="form-column">
                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleMake">Vehicle Make</label>
                  <input
                    className="form-input"
                    id="vehicleMake"
                    name="vehicleMake"
                    type="text"
                    value={formData.vehicleMake}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleModel">Vehicle Model</label>
                  <input
                    className="form-input"
                    id="vehicleModel"
                    name="vehicleModel"
                    type="text"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleYear">Vehicle Year</label>
                  <input
                    className="form-input"
                    id="vehicleYear"
                    name="vehicleYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    maxLength="4"
                    value={formData.vehicleYear}
                    onChange={handleChange}
                    required
                  />
                  {errors.vehicleYear && <span className="error-message">{errors.vehicleYear}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleColor">Vehicle Color</label>
                  <input
                    className="form-input"
                    id="vehicleColor"
                    name="vehicleColor"
                    type="text"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    pattern="[a-zA-Z\s]*"
                    title="Color should contain only letters"
                  />
                  {errors.vehicleColor && <span className="error-message">{errors.vehicleColor}</span>}
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleType">Vehicle Type</label>
                  <select
                    className="form-input"
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">Select Vehicle Type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleCapacity">Vehicle Capacity</label>
                  <input
                    className="form-input"
                    id="vehicleCapacity"
                    name="vehicleCapacity"
                    type="number"
                    min="1"
                    value={formData.vehicleCapacity}
                    onChange={handleChange}
                    required
                  />
                  {errors.vehicleCapacity && <span className="error-message">{errors.vehicleCapacity}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleFuelType">Vehicle Fuel Type</label>
                  <select
                    className="form-input"
                    id="vehicleFuelType"
                    name="vehicleFuelType"
                    value={formData.vehicleFuelType}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">Select Fuel Type</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceStatus">Insurance Status</label>
                  <select
                    className="form-input"
                    id="insuranceStatus"
                    name="insuranceStatus"
                    value={formData.insuranceStatus ? 'active' : 'not active'}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="not active">Not Active</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="submit-container">
              <button className="submit-btn" type="submit">ADD VEHICLE</button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AddVehicle;