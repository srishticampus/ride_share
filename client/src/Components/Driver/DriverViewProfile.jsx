import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';

function DriverViewProfile() {
  return (
    <div>
        <h1>View Profile</h1>
    <div className="profile-card">
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL7yEGVr0WDqJTtcLbXpUXmUSwwzlHDtF1XA&s" 
        alt="Profile" 
      />
      <div className='profile-details'>
      <h2>Sarath R S</h2>
      <h4>ADDRESS: Varkala</h4>
      <h4>E-MAIL ID: Sarath@123@gmail.com</h4>
      <p>PHONE NO: 1234567890</p>

      </div>
      <Button variant="contained">Edit</Button>
    </div>

    </div>
  );
}

export default DriverViewProfile;