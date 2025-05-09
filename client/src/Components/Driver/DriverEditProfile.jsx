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
import apiService from '../../Services/apiService';
import { useNavigate } from 'react-router-dom';

const DriverEditProfile = ({ setShowProfileEditCard }) => {
  const navigate = useNavigate();
  const Driverdata = JSON.parse(localStorage.getItem("driverData"));
  console.log(Driverdata);
  
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullname: Driverdata?.fullname || '',
    email: Driverdata?.email || '',
    phoneNumber: Driverdata?.phoneNumber || '',
    licenseNumber: Driverdata?.licenseNumber || '',
    profilePicture: null
  });
  
  const [avatarSrc, setAvatarSrc] = useState(
    Driverdata?.driverPic 
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
      const formDataToSend = new FormData();
      formDataToSend.append('fullname', formData.fullname);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      
      if (formData.licenseNumber) {
        formDataToSend.append('licenseNumber', formData.licenseNumber);
      }
      
      if (formData.profilePicture) {
        formDataToSend.append('driverPic', formData.profilePicture);
      }

      const response = await apiService.updateDriverProfile(formDataToSend);
            
      const updatedDriverData = {
        ...Driverdata,
        ...response.data.driver
      };
      localStorage.setItem("driverData", JSON.stringify(updatedDriverData));
      
      toast.success('Profile updated successfully!');
      setTimeout(() => setShowProfileEditCard(false), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error('Update error:', error);
    }
  };

  return (
    <Box className="styled-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box className="styled-header">
        <Typography className="header-title" variant="h6">EDIT PROFILE</Typography>
        <IconButton className="close-button" onClick={() => setShowProfileEditCard(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className="styled-main-content">
        <Box className="profile-section">
          <Box className="avatar-container">
            <Avatar className="styled-avatar" src={avatarSrc} sx={{ width: 100, height: 100 }} />
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
            <Grid item xs={12} md={6}>
              <Typography className="left-label" variant="body1">Full Name</Typography>
              <TextField
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Your Name"
                className="styled-textfield"
                required
              />

              <Typography className="left-label" variant="body1">Email</Typography>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Email"
                className="styled-textfield"
                type="email"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography className="right-label" variant="body1">Phone Number</Typography>
              <TextField
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Phone Number"
                className="styled-textfield"
                required
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

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              className="gradient-button"
              onClick={handleSubmit}
              size="large"
              sx={{
                padding: '12px 36px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              UPDATE PROFILE
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DriverEditProfile;