import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DriverNav from './DriverNav'; 

function DriverViewProfile() {
  const driverData = JSON.parse(localStorage.getItem("driverData"));   
  console.log(driverData);
    
  return (
    <div>
      <DriverNav/>
      <h1>View Profile</h1>
      <div className="profile-card">
        <img 
          src={`http://localhost:4040/api/v1/${driverData.driverPic
          }`}
          alt={driverData.fullname} 
        />
        <div className='profile-details'>
          <h2>{driverData.fullname}</h2>
          <h4>ADDRESS: {driverData.address}</h4>
          <h4>E-MAIL ID: {driverData.email}</h4>
          <p>PHONE NO: {driverData.phoneNumber}</p>
        </div>
        <Link to='/driver-edit-profile'>
          <Button variant="contained">Edit</Button>
        </Link>
      </div>
    </div>
  );
}

export default DriverViewProfile;