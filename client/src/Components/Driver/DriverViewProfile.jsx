import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DriverNav from './DriverNav'; 

function DriverViewProfile({onEditClick}) {
  const driverData = JSON.parse(localStorage.getItem("driverData"));   
  console.log(driverData);

  const DriverProfile = driverData.driverPic.filename 
  ? `http://localhost:4040/api/v1/${driverData.driverPic}`
  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; 


  return (
    <div>
      <DriverNav/>
      <div className="profile-card">
        <img 
          src={DriverProfile}
          alt={driverData.fullname} 
        />
        <div className='profile-details'>
          <h2>{driverData.fullname}</h2>
          <h4> vehicleRegNumber: {driverData.vehicleRegNumber}</h4>
          <h4>E-MAIL ID: {driverData.email}</h4>
          <p>PHONE NO: {driverData.phoneNumber}</p>
        </div>
      <Button variant="contained" onClick={onEditClick}>Edit</Button>
      </div>
    </div>
  );
}

export default DriverViewProfile;