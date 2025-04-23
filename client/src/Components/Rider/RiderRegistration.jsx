import React, { useState } from 'react';
import { TextField, Button, FormLabel, CircularProgress , InputAdornment, IconButton} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Service from '../../Services/apiService';
import Logo from '../../Assets/RideShare.png';
import '../Style/DriverRegistration.css';
import LandindNav from '../Common/LandingNav';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function RiderRegistration() {
  const navigate = useNavigate();
  const [rider, setRider] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    emergencyNo: ""

  });
  const [profilePicture, setProfilePicture] = useState(null);
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
    setRider(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rider.email || !rider.fullName || !rider.phoneNumber ||
      !rider.address || !rider.password || !rider.confirmPassword || !profilePicture) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rider.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!/^\d{10}$/.test(rider.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{10}$/.test(rider.emergencyNo)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (rider.password !== rider.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (rider.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const riderData = {
        email: rider.email,
        fullName: rider.fullName,
        phoneNumber: rider.phoneNumber,
        emergencyNo: rider.emergencyNo,
        address: rider.address,
        password: rider.password,
        profilePicture: profilePicture
      };

      const response = await Service.register(riderData);
      console.log(response);

      if (response.status === 'success') {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/User-login');
        }, 2000);

      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'An error occurred during registration';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <LandindNav />
      <ToastContainer />
      <div className="registration-logo">
        <img src={Logo} alt="Company Logo" className="logo-image" />
      </div>

      <div className="registration-form">
        <h2 className="registration-title">RIDER REGISTRATION</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="registration-form-container">
          <div className='reg-main-container'>
            <div className='reg-left'>
              <FormLabel className="reg-form-label">Full Name *</FormLabel>
              <TextField
                name="fullName"
                value={rider.fullName}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter your full name"
              />

              <FormLabel className="reg-form-label">Email *</FormLabel>
              <TextField
                name="email"
                type="email"
                value={rider.email}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter your email"
              />

              <FormLabel className="reg-form-label">Phone Number *</FormLabel>
              <TextField
                name="phoneNumber"
                value={rider.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter 10-digit phone number"
                inputProps={{ maxLength: 10 }}
              />

              <FormLabel className="reg-form-label">Emergency Number *</FormLabel>
              <TextField
                name="emergencyNo"
                value={rider.emergencyNo}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter 10-digit phone number"
                inputProps={{ maxLength: 10 }}
              />
            </div>

            <div className='reg-right'>
              <FormLabel className="reg-form-label">Address *</FormLabel>
              <TextField
                name="address"
                value={rider.address}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Enter your address"
              />

              <FormLabel className="reg-form-label">Password *</FormLabel>
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                value={rider.password}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
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
              />

              <FormLabel className="reg-form-label">Confirm Password *</FormLabel>
              <TextField
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={rider.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                fullWidth
                margin="normal"
                required
                placeholder="Confirm your password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
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
              />              <FormLabel className="reg-form-label">Profile Picture *</FormLabel>
              <TextField
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="form-input"
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
              Already have an account? <a href="/rider/login" className="login-link">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RiderRegistration;