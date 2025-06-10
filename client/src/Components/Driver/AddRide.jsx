import React, { useState, useEffect } from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../Services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import { ClickAwayListener } from '@mui/material';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';

const AddRide = () => {
  const [currentDriver, setCurrentDriver] = useState({});
  const [minDateTime, setMinDateTime] = useState('');
  const [errors, setErrors] = useState({});
  const [hasVehicle, setHasVehicle] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    rideDateTime: '',
    availableSeats: 1,
    price: '',
    rideDescription: '',
    specialNote: '',
    route: '',
    distanceKm: '',
    tripDurationMin: '',
    demandLevel: '',
  });

  const fetchDriverData = async () => {
    try {
      const driverData = await apiService.getCurrentDriver();
      const driver = driverData.data.driver;
      console.log("Fetched Driver Data:", driver);

      setCurrentDriver(driver);
      setHasVehicle(!!driver.vehicleId);

      if (driver.vehicleId) {
        setFormData(prev => ({
          ...prev,
          availableSeats: driver.vehicleId.vehicleCapacity
        }));
      }
    } catch (error) {
      console.error("Failed to load driver data:", error);
      // toast.error("Failed to load driver data. Please refresh.");
    }
  };

  useEffect(() => {
    fetchDriverData();

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  const getTimeOfDay = (date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Ensure the output matches the expected format for the model (e.g., "weekend" for Sat/Sun)
    const dayName = days[date.getDay()];
    if (dayName === 'Saturday' || dayName === 'Sunday') {
        return 'Weekend'; // Assuming model expects 'Weekend' for Saturday/Sunday
    }
    return 'Weekday'; // Assuming model expects 'Weekday' for Monday-Friday
  };

  useEffect(() => {
    const { origin, destination, rideDateTime, distanceKm, tripDurationMin, demandLevel } = formData;

    const calculatePredictedPrice = async () => {
      // Ensure all required inputs for prediction are present and valid
      if (!origin || !destination || !rideDateTime || !distanceKm || !tripDurationMin || !demandLevel) {
        return;
      }

      const parsedDistance = parseFloat(distanceKm);
      const parsedDuration = parseFloat(tripDurationMin);

      if (isNaN(parsedDistance) || parsedDistance <= 0 || isNaN(parsedDuration) || parsedDuration <= 0) {
          console.warn("Invalid distance or duration, skipping prediction.");
          return;
      }

      const rideDateObj = new Date(rideDateTime);
      if (isNaN(rideDateObj.getTime())) {
        console.warn("Invalid rideDateTime, skipping prediction.");
        return;
      }

      setIsPredicting(true);
      try {
        const predictionInput = {
          distance_km: parsedDistance,
          trip_duration_min: parsedDuration,
          time_of_day: getTimeOfDay(rideDateObj).toLowerCase(), // Convert to lowercase as per example
          day_of_week: getDayOfWeek(rideDateObj).toLowerCase(), // Convert to lowercase as per example
          demand_level: demandLevel.toLowerCase(), // Convert to lowercase as per example
        };
        
        console.log('Sending prediction request with:', predictionInput);
        const response = await apiService.predictPrice(predictionInput);

        if (response && response.data && typeof response.data.fare === 'number') {
          setFormData(prev => ({
            ...prev,
            price: response.data.fare.toFixed(2)
          }));
          // toast.info(`Suggested price: ₹${response.data.fare.toFixed(2)}`, { autoClose: 3000 });
          alert(`Suggested price: ₹${response.data.fare.toFixed(2)}`)
        } else {
          console.warn('Invalid prediction response:', response);
          // toast.warn('Could not get a valid price prediction.', { autoClose: 3000 });
          alert('Could not get a valid price prediction.')
        }
      } catch (error) {
        console.error('Error predicting fare:', error);
        const errorMsg = error.response?.data?.error || 
                        error.response?.data?.details || 
                        'Failed to predict price. Please check inputs.';
        // toast.error(errorMsg, { autoClose: 5000 });
        console.log(errorMsg);
        
      } finally {
        setIsPredicting(false);
      }
    };

    const handler = setTimeout(() => {
      calculatePredictedPrice();
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [formData.origin, formData.destination, formData.rideDateTime, 
      formData.distanceKm, formData.tripDurationMin, formData.demandLevel]);

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

    if (!formData.origin.trim()) newErrors.origin = 'Pickup location is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';

    if (!formData.rideDateTime) {
      newErrors.rideDateTime = 'Ride date and time are required';
    } else {
      const selectedDateTime = new Date(formData.rideDateTime);
      if (isNaN(selectedDateTime.getTime())) {
        newErrors.rideDateTime = 'Invalid date and time selected';
      } else if (selectedDateTime < now) {
        newErrors.rideDateTime = 'Cannot select past date and time';
      }
    }

    if (!formData.distanceKm || parseFloat(formData.distanceKm) <= 0) {
      newErrors.distanceKm = 'Distance is required and must be positive';
    }
    if (!formData.tripDurationMin || parseFloat(formData.tripDurationMin) <= 0) {
      newErrors.tripDurationMin = 'Trip duration is required and must be positive';
    }
    if (!formData.demandLevel) {
      newErrors.demandLevel = 'Demand level is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
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
      // toast.error('You must add vehicle details before creating a ride. Redirecting...', { autoClose: 3000 });
      alert('You must add vehicle details before creating a ride. Redirecting...')
      setTimeout(() => {
        navigate('/driver-Add-Vehicle');
      }, 3000);
      return;
    }

    if (!validateForm()) {
      // toast.error('Please fix the form errors before submitting');
      alert('Please fix the form errors before submitting')
      return;
    }

    try {
      const rideDateTime = new Date(formData.rideDateTime);
      const rideDate = rideDateTime.toISOString().split('T')[0];
      const hours = rideDateTime.getHours().toString().padStart(2, '0');
      const minutes = rideDateTime.getMinutes().toString().padStart(2, '0');
      const rideTime = `${hours}:${minutes}`;

      const rideData = {
        VehicleId: currentDriver.vehicleId._id,
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        rideDate: rideDate,
        rideTime: rideTime,
        availableSeats: parseInt(formData.availableSeats),
        price: parseFloat(formData.price),
        rideDescription: formData.rideDescription.trim(),
        specialNote: formData.specialNote.trim(),
        route: formData.route.trim()
      };

      console.log('Submitting ride data:', rideData);
      await apiService.createRide(rideData);
      // toast.success('Ride created successfully!');
      console.log('Ride created successfully!');
      

      setFormData({
        origin: '',
        destination: '',
        rideDateTime: '',
        availableSeats: currentDriver?.vehicleId?.vehicleCapacity || 1,
        price: '',
        rideDescription: '',
        specialNote: '',
        route: '',
        distanceKm: '',
        tripDurationMin: '',
        demandLevel: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating ride:', error);
      // toast.error(error.response?.data?.message || 'Failed to create ride. Please try again.');
      alert(error.response?.data?.message || 'Failed to create ride. Please try again.')
    }
  };

  return (
    <div className="payment-container">
      <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} 
        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {showProfileCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{ position: "absolute", top: "40px", right: "20px", zIndex: "10" }}>
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
               fetchDriverData={fetchDriverData}
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
                <label className="form-label" htmlFor="distanceKm">Distance (KM)*</label>
                <input
                  className={`form-input ${errors.distanceKm ? 'is-invalid' : ''}`}
                  id="distanceKm"
                  name="distanceKm"
                  placeholder="e.g., 10.5"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.distanceKm}
                  onChange={handleChange}
                />
                {errors.distanceKm && <div className="invalid-feedback">{errors.distanceKm}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tripDurationMin">Estimated Trip Duration (Min)*</label>
                <input
                  className={`form-input ${errors.tripDurationMin ? 'is-invalid' : ''}`}
                  id="tripDurationMin"
                  name="tripDurationMin"
                  placeholder="e.g., 30"
                  type="number"
                  min="1"
                  value={formData.tripDurationMin}
                  onChange={handleChange}
                />
                {errors.tripDurationMin && <div className="invalid-feedback">{errors.tripDurationMin}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="demandLevel">Demand Level*</label>
                <select
                  className={`form-input ${errors.demandLevel ? 'is-invalid' : ''}`}
                  id="demandLevel"
                  name="demandLevel"
                  value={formData.demandLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Demand Level</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Peak">Peak</option>
                </select>
                {errors.demandLevel && <div className="invalid-feedback">{errors.demandLevel}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="availableSeats">Available Seats*</label>
                <input
                  className={`form-input ${errors.availableSeats ? 'is-invalid' : ''}`}
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  min="1"
                  max={currentDriver?.vehicleId?.vehicleCapacity || 15}
                  value={formData.availableSeats}
                  onChange={handleChange}
                  disabled
                />
                {errors.availableSeats && <div className="invalid-feedback">{errors.availableSeats}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Price (₹) 
                  {isPredicting && <span className="predicting-label">(Calculating...)</span>}
                  {!isPredicting && formData.price && <span className="predicted-label">(Suggested)</span>}
                </label>
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
              <button 
                className="submit-btn" 
                type="submit"
                disabled={isPredicting}
              >
                {isPredicting ? 'Processing...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AddRide;