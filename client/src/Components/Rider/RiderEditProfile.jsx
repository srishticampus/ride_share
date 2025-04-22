import React, { useRef, useState } from 'react';
import '../Style/RiderEditProfile.css';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import service from '../../Services/apiService';
import { useNavigate } from 'react-router-dom';

const RiderEditProfile = () => {
  const navigate = useNavigate();
  const riderData = JSON.parse(localStorage.getItem("riderData"));
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: riderData.fullName,
    email: riderData.email,
    phoneNumber: riderData.phoneNumber,
    emergencyNo: riderData.emergencyNo,
    address: riderData.address,
    profilePicture: null
  });
  
  const [avatarSrc, setAvatarSrc] = useState(
    riderData.profilePicture 
      ? `http://localhost:4040/${riderData.profilePicture}`
      : 'https://passport-photo.online/images/cms/prepare_light_b364e3ec37.webp?quality=80&format=webp&width=1920'
  );

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarSrc(imageUrl);
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('emergencyNo', formData.emergencyNo);
      data.append('address', formData.address);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }

      const response = await service.updateProfile(formData);
            
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate(-1), 1500); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error('Update error:', error);
    }
  };

  return (
    <Box className="styled-container">
      <ToastContainer />
      <Box className="styled-header">
        <Typography className="header-title" variant="h6">EDIT PROFILE</Typography>
        <IconButton className="close-button" onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className="styled-main-content">
        <Box className="profile-section">
          <Box className="avatar-container">
            <Avatar className="styled-avatar" src={avatarSrc} />
            <EditOutlinedIcon
              className="styled-edit-icon"
              onClick={handleEditClick}
              style={{ cursor: 'pointer' }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Box>
          <Typography className="name-text" variant="h6">{formData.fullName}</Typography>
        </Box>

        <Box sx={{ width: '100%' }} className="form-container">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography className="left-label" variant="body1">Name</Typography>
              <TextField
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Your Name"
                className="styled-textfield"
              />

              <Typography className="left-label" variant="body1">E-Mail</Typography>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Mail ID"
                className="styled-textfield"
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className="right-label" variant="body1">Phone Number</Typography>
              <TextField
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Your Number"
                className="styled-textfield"
              />

              <Typography className="right-label" variant="body1">Emergency Contact</Typography>
              <TextField
                name="emergencyNo"
                value={formData.emergencyNo}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Emergency Contact"
                className="styled-textfield"
              />
            </Grid>

          </Grid>
          <Grid item xs={12}>
              <Typography className="left-label" variant="body1">Address</Typography>
              <TextField
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Your Address"
              />
            </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              className="gradient-button"
              onClick={handleSubmit}
            >
              UPDATE
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RiderEditProfile;