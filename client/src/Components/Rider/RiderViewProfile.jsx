import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RiderNav from './RiderNav';

function RiderViewProfile() {
  const riderData = JSON.parse(localStorage.getItem("riderData"));   
   console.log(riderData);
    
  return (
    <div>
      <RiderNav/>
        <h1>View Profile</h1>
    <div className="profile-card">
      <img 
        src={`http://localhost:4040/api/v1/${riderData.profilePicture}`}
        alt={riderData.fullName} 
      />
      <div className='profile-details'>
      <h2>{riderData.fullName}</h2>
      <h4>ADDRESS: {riderData.address}</h4>
      <h4>E-MAIL ID: {riderData.email}</h4>
      <p>PHONE NO: {riderData.phoneNumber}</p>

      </div>
      <Link to='/User-Edit-profile'>
      <Button variant="contained">Edit</Button>

      </Link>
    </div>

    </div>
  );
}

export default RiderViewProfile;