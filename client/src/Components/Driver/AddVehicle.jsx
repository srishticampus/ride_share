import React, { useState } from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import service from '../../Services/apiService';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleRegistrationNo: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleType: '',
    vehicleCapacity: '',
    vehicleFuelType: '',
    driverId: '',
    insuranceStatus: 'active' 
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
      await service.registerVehicle(formData);
      alert('Vehicle added successfully!');
      setFormData({
        vehicleRegistrationNo: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        vehicleType: '',
        vehicleCapacity: '',
        vehicleFuelType: '',
        driverId: '',
        insuranceStatus: 'active'
      });
    } catch (error) {
      alert(error.message || 'Failed to add vehicle');
    }
  };

  return (
    <div className="payment-container">
      <DriverNav/>
      <main className="payment-main">
        <section className="payment-section">
          <h1 className="payment-title">ADD VEHICLE</h1>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="vehicleRegistrationNo">Vehicle Registration No</label>
                <input
                  className="form-input"
                  id="vehicleRegistrationNo"
                  name="vehicleRegistrationNo"
                  placeholder="Enter vehicle registration number"
                  type="text"
                  value={formData.vehicleRegistrationNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vehicleMake">Vehicle Make</label>
                <input
                  className="form-input"
                  id="vehicleMake"
                  name="vehicleMake"
                  placeholder="Enter vehicle make"
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
                  placeholder="Enter vehicle model"
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
                  placeholder="Enter vehicle year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vehicleColor">Vehicle Color</label>
                <input
                  className="form-input"
                  id="vehicleColor"
                  name="vehicleColor"
                  placeholder="Enter vehicle color"
                  type="text"
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vehicleType">Vehicle Type</label>
                <input
                  className="form-input"
                  id="vehicleType"
                  name="vehicleType"
                  placeholder="Enter vehicle type"
                  type="text"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vehicleCapacity">Vehicle Capacity</label>
                <input
                  className="form-input"
                  id="vehicleCapacity"
                  name="vehicleCapacity"
                  placeholder="Enter passenger capacity"
                  type="number"
                  min="1"
                  value={formData.vehicleCapacity}
                  onChange={handleChange}
                  required
                />
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
                  <option value="active">Patrol</option>
                  <option value="not active">Diesel</option>
                  <option value="not active">Eletric</option>

                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="driverId">Driver ID</label>
                <input
                  className="form-input"
                  id="driverId"
                  name="driverId"
                  placeholder="Enter driver ID"
                  type="text"
                  value={formData.driverId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="insuranceStatus">Insurance Status</label>
                <select
                  className="form-input"
                  id="insuranceStatus"
                  name="insuranceStatus"
                  value={formData.insuranceStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="not active">Not Active</option>
                </select>
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