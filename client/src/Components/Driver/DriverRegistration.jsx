import React, { useState } from 'react';
import { TextField, Button, FormLabel, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Service from '../../Services/apiService';
import Logo from '../../Assets/RideShare.png';
import '../Style/DriverRegistration.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LandingNav from '../Common/LandingNav'

function DriverRegistration() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState({
    email: '',
    fullname: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleRegNumber: '',
    password: '',
    confirmPassword: '',
    driverPic: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let filteredValue = value;
    
    switch(name) {
      case 'fullname':
        filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'phoneNumber':
        filteredValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'licenseNumber':
        filteredValue = value.replace(/\D/g, '').slice(0, 16);
        break;
      case 'vehicleRegNumber':
      case 'email':
      case 'password':
      case 'confirmPassword':
      default:
        break;
    }
    
    setDriver(prev => ({ ...prev, [name]: filteredValue }));
  };

  const handleVehicleRegChange = (e) => {
    const { value } = e.target;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setDriver(prev => ({ ...prev, vehicleRegNumber: filteredValue }));
  };

  const handleFileChange = (e) => {
    setDriver(prev => ({ ...prev, driverPic: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driver.email || !driver.password || !driver.fullname ||
      !driver.phoneNumber || !driver.licenseNumber ||
      !driver.vehicleRegNumber || !driver.driverPic) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driver.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(driver.fullname)) {
      toast.error('Full name should only contain alphabets');
      return;
    }

    if (!/^\d{10}$/.test(driver.phoneNumber)) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    if (!/^\d{16}$/.test(driver.licenseNumber)) {
      toast.error('License number must be 16 digits');
      return;
    }

    if (!/^[A-Z0-9]+$/.test(driver.vehicleRegNumber)) {
      toast.error('Vehicle registration should be uppercase alphanumeric with no spaces or special characters');
      return;
    }

    if (driver.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (driver.password !== driver.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const driverData = {
        email: driver.email,
        fullname: driver.fullname,
        phoneNumber: driver.phoneNumber,
        licenseNumber: driver.licenseNumber,
        vehicleRegNumber: driver.vehicleRegNumber,
        password: driver.password,
        driverPic: driver.driverPic
      };

      const response = await Service.registerDriver(driverData);
      console.log(response);

      if (response.status == "success") {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/driver-login');
        }, 2000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.message && error.message.includes('E11000 duplicate key error') && 
          error.message.includes('licenseNumber')) {
        toast.error('This license number is already registered');
      } 
      else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred during registration');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <LandingNav />
      <div className="registration-logo">
        <img src={Logo} alt="Company Logo" className="logo-image" />
      </div>

      <div className="registration-form">
        <h2 className="registration-title">DRIVER REGISTRATION</h2>

        <form onSubmit={handleSubmit} className="registration-form-container">
          <div className='reg-main-container'>
            <div className='reg-left'>
              <FormLabel className="reg-form-label">Full Name *</FormLabel>
              <TextField
                name="fullname"
                value={driver.fullname}
                placeholder="Enter your full name"
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                inputProps={{ 
                  pattern: "[a-zA-Z\\s]*",
                  title: "Only alphabets and spaces are allowed"
                }}
              />

              <FormLabel className="reg-form-label">Email *</FormLabel>
              <TextField
                name="email"
                type="email"
                value={driver.email}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                placeholder="Enter your email"
                required
                inputProps={{
                  pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                  title: "Please enter a valid email address"
                }}
              />

              <FormLabel className="reg-form-label">Phone Number *</FormLabel>
              <TextField
                name="phoneNumber"
                type="tel"
                value={driver.phoneNumber}
                autoComplete="off"
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter 10-digit phone number"
                inputProps={{ 
                  maxLength: 10,
                  pattern: "\\d{10}",
                  title: "Please enter exactly 10 digits"
                }}
              />

              <FormLabel className="reg-form-label">Vehicle Registration *</FormLabel>
              <TextField
                name="vehicleRegNumber"
                value={driver.vehicleRegNumber}
                onChange={handleVehicleRegChange}
                className="form-input"
                fullWidth
                placeholder="Enter Vehicle Registration"
                margin="normal"
                required
                inputProps={{
                  pattern: "[A-Z0-9]+",
                  title: "Only uppercase alphanumeric characters are allowed"
                }}
              />
            </div>

            <div className='reg-right'>
              <FormLabel className="reg-form-label">License Number *</FormLabel>
              <TextField
                name="licenseNumber"
                value={driver.licenseNumber}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                placeholder="Enter 16-digit License Number"
                margin="normal"
                required
                inputProps={{
                  maxLength: 16,
                  pattern: "\\d{16}",
                  title: "Please enter exactly 16 digits"
                }}
              />

              <FormLabel className="reg-form-label">Password *</FormLabel>
              <TextField
                name="password"
                value={driver.password}
                type={showPassword ? "text" : "password"}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                autoComplete="new-password"
                placeholder="Enter password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        style={{ color: '#f1b92e' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                required
              />

              <FormLabel className="reg-form-label">Confirm Password *</FormLabel>
              <TextField
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} 
                value={driver.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                autoComplete="new-password"
                placeholder="Confirm your password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        style={{ color: '#f1b92e' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                margin="normal"
                required
              />

              <FormLabel className="reg-form-label">Profile Photo *</FormLabel>
              <TextField
                type="file"
                onChange={handleFileChange}
                className="form-input file-input"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
                required
              />
            </div>
          </div>

          <div className="registration-actions">
            <Button
              type="submit"
              variant="contained"
              className="register-button"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? <CircularProgress size={24} className="submit-spinner" /> : 'REGISTER'}
            </Button>

            <p className="login-text">
              Already have an account? <Link to={"/driver-login"} className="login-link">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverRegistration;