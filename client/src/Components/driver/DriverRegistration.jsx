import React from 'react';
import Logo from '../../Assets/logo.png';
import { TextField, FormLabel, Button } from '@mui/material';
import '../Style/DriverRegistration.css';

function DriverRegistration() {
  return (
    <div className="registration-container">
      <div className="registration-logo">
        <img src={Logo} alt="Company Logo" />
      </div>
      
      <div className="registration-form">
        <h2 className="registration-title">REGISTRATION</h2>
        <div className='reg-main-container'>
          <div className='reg-left'>
            <FormLabel className="reg-form-label">Name</FormLabel>
            <TextField
              placeholder='Enter your Full Name'
              name='Name'
              type='text'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">E-Mail</FormLabel>
            <TextField
              name='Email'
              placeholder='Enter your Mail ID'
              type='email'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Phone Number</FormLabel>
            <TextField
              name='PhoneNo'
              placeholder='Enter your Number'
              type='tel'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Vehicle Registration Number</FormLabel>
            <TextField
              name='VehicleRegNumber'
              placeholder='Enter Register Number'
              type='text'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Vehicle Type & Model</FormLabel>
            <TextField
              name='VehicleTypeModel'
              placeholder='Enter your Vehicle Type & Model'
              type='text'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
          </div>
          
          <div className='reg-right'>
            <FormLabel className="reg-form-label">Create Password</FormLabel>
            <TextField
              name='Password'
              placeholder='Enter your Password'
              type='password'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Confirm Password</FormLabel>
            <TextField
              name='ConfirmPassword'
              placeholder='Enter your Password'
              type='password'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Driving License</FormLabel>
            <TextField
              name='DrivingLicense'
              placeholder='Enter your Driving License Number'
              type='text'
              required
              margin='normal'
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Driving Experience</FormLabel>
            <TextField
              name='DrivingExperience'
              placeholder='Enter your Driving Experience'
              type='number'
              required
              margin='normal'
              inputProps={{ min: 0, max: 50 }}
              className="form-input"
              variant="outlined"
            />
            
            <FormLabel className="reg-form-label">Profile Picture</FormLabel>
            <TextField
              type='file'
              name='ProfilePicture'
              required
              margin='normal'
              InputLabelProps={{ shrink: true }}
              className="form-input file-input"
              variant="outlined"
            />
          </div>
        </div>
        <div className="registration-actions">
          <Button variant="contained" className="register-button">
            Register
          </Button>
          <span className="login-text">
           <p style={{color:"white"}}> Already have an account? <a href="/login" className="login-link">LOG IN</a></p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default DriverRegistration;