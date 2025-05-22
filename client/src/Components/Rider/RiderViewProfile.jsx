import React from 'react';
import '../Style/Profile.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RiderNav from './RiderNav';
import { imageBaseUrl} from '../../Services/apiService';

function RiderViewProfile({ onEditClick, currentUser }) {
  const UserProfile = currentUser.profilePicture 
    ? `${imageBaseUrl}${currentUser.profilePicture}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; 

  return (
    <div className="profile-card" >
      <img 
        src={UserProfile}
        alt={currentUser.fullName} 
      />
      <div className='profile-details' >
        <h2>{currentUser.fullName}</h2>
        <h4>Address: {currentUser.address}</h4>
        <h4>E-Mail: {currentUser.email}</h4>
        <p>PHONE NO: {currentUser.phoneNumber}</p>
        <p>Emergency No: {currentUser.emergencyNo}</p>
      </div>
      <Button variant="contained" onClick={onEditClick}>Edit</Button>
    </div>
  );
}

export default RiderViewProfile;