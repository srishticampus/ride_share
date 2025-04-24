import React, { useState } from 'react';
import { TextField, Button, FormLabel, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
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
    setDriver(prev => ({ ...prev, [name]: value }));
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

      if (error.message.includes('Cast to Number failed')) {
        toast.error('Server error: Invalid email format. Please try again or contact support.');
      } else
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(error.message || 'An error occurred during registration');
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <LandingNav/>
      <ToastContainer />
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
              />

              <FormLabel className="reg-form-label">Phone Number *</FormLabel>
              <TextField
                name="phoneNumber"
                value={driver.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter 10-digit phone number"
                inputProps={{ maxLength: 10 }}
              />

              <FormLabel className="reg-form-label">Vehicle Registration *</FormLabel>
              <TextField
                name="vehicleRegNumber"
                value={driver.vehicleRegNumber}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                placeholder="Enter Vehicle Registration number"

                margin="normal"
                required
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
                placeholder="Enter License Number"
                margin="normal"
                required
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
                placeholder="Enter password (min 8 characters)"
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
                type="password"
                value={driver.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                placeholder="Enter password (min 8 characters)"
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
              Already have an account? <a href="/driver-login" className="login-link">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverRegistration;