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

const DriverEditProfile = () => {
  const navigate = useNavigate();
  const Driverdata = JSON.parse(localStorage.getItem("driverData"));
  console.log(Driverdata);
  
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullname: Driverdata.fullname,
    email: Driverdata.email,
    phoneNumber: Driverdata.phoneNumber,
    licenseNumber: Driverdata.licenseNumber,
    vehicleRegNumber: Driverdata.vehicleRegNumber,
    profilePicture: null
  });
  
  const [avatarSrc, setAvatarSrc] = useState(
    Driverdata.driverPic 
      ? `http://localhost:4040/uploads/${Driverdata.driverPic}`
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
      data.append('fullname', formData.fullname);
      data.append('email', formData.email);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('licenseNumber', formData.licenseNumber);
      data.append('vehicleRegNumber', formData.vehicleRegNumber);
      if (formData.profilePicture) {
        data.append('driverPic', formData.profilePicture);
      }

      const response = await service.u(data);
            
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
          <Typography className="name-text" variant="h6">{formData.fullname}</Typography>
        </Box>

        <Box sx={{ width: '100%' }} className="form-container">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography className="left-label" variant="body1">Name</Typography>
              <TextField
                name="fullname"
                value={formData.fullname}
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

              <Typography className="right-label" variant="body1">License Number</Typography>
              <TextField
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter License Number"
                className="styled-textfield"
              />
            </Grid>

          </Grid>
          <Grid item xs={12}>
              <Typography className="left-label" variant="body1">Vehicle Registration Number</Typography>
              <TextField
                name="vehicleRegNumber"
                value={formData.vehicleRegNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Vehicle Registration Number"
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

export default DriverEditProfile;