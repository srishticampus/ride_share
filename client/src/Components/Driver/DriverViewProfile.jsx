import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';
export const imageBaseUrl = import.meta.env.VITE_API_URL;


function DriverViewProfile({ onEditClick, driver }) {
  console.log(imageBaseUrl);
  
  const DriverProfile = driver?.driverPic?.filename 
    ? `${imageBaseUrl}/${driver.driverPic.filename}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  return (
    <div className="profile-card">
      <img 
        src={DriverProfile}
        alt={driver.fullname || "Driver Profile"} 
      />
      <div className='profile-details'>
        <h2>{driver.fullname}</h2>
        <h4>Vehicle Reg Number: {driver.vehicleRegNumber}</h4>
        <h4>Email: {driver.email}</h4>
        <p>Phone: {driver.phoneNumber}</p>
      </div>
      <Button variant="contained" onClick={onEditClick}>Edit</Button>
    </div>
  );
}

export default DriverViewProfile;
