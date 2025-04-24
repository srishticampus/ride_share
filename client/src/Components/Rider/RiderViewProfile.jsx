import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RiderNav from './RiderNav';

function RiderViewProfile({onEditClick}) {
  const riderData = JSON.parse(localStorage.getItem("riderData"));   
   console.log(riderData);
    
   const UserProfile = riderData.ProfilePhoto?.filename 
   ? `http://localhost:4040/api/v1/${riderData.profilePicture}`
   : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; 


  return (
    <div>
      <RiderNav/>
    <div className="profile-card">
      <img 
        src={UserProfile}
        alt={riderData.fullName} 
      />
      <div className='profile-details'>
      <h2>{riderData.fullName}</h2>
      <h4>ADDRESS: {riderData.address}</h4>
      <h4>E-MAIL ID: {riderData.email}</h4>
      <p>PHONE NO: {riderData.phoneNumber}</p>

      </div>
      <Button variant="contained" onClick={onEditClick}>Edit</Button>

    </div>

    </div>
  );
}

export default RiderViewProfile;