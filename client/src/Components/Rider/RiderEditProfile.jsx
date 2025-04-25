import React, { useRef, useState } from 'react';
import '../Style/RiderEditProfile.css';
import {
  Box, Typography, IconButton, Avatar,
  TextField, Button, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import service from '../../Services/apiService';

const RiderEditProfile = ({ setShowProfileEditCard, currentUser, setCurrentUser }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || '',
    email: currentUser.email || '',
    phoneNumber: currentUser.phoneNumber || '',
    emergencyContact: currentUser.emergencyNo || '',
    address: currentUser.address || '',
    profilePicture: currentUser.profilePicture || ""
  });

  const [avatarSrc, setAvatarSrc] = useState(
    currentUser.profilePicture
      ? `http://localhost:4052/ride_share_api/${currentUser.profilePicture}`
      : 'https://passport-photo.online/images/cms/prepare_light_b364e3ec37.webp?quality=80&format=webp&width=1920'
  );

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarSrc(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fullName') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } 
    else if (name === 'phoneNumber' || name === 'emergencyContact') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } 
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      toast.error('Name should contain only letters');
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    if (!/^\d{10}$/.test(formData.emergencyContact)) {
      toast.error('Emergency contact must be 10 digits');
      return;
    }

    try {
      const response = await service.updateProfile(formData);
      console.log(response);

      if (response.status === 'success') {
        setCurrentUser(prev => ({
          ...prev,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          emergencyNo: formData.emergencyContact,
          address: formData.address,
          profilePicture: response.data.user.profilePicture 
        }));

        if (response.data.user.profilePicture) {
          setAvatarSrc(`http://localhost:4052${response.data.user.profilePicture}`);
        }

        // toast.success('Profile updated successfully!');
        
        setTimeout(() => {
          setShowProfileEditCard(false);
        }, 1500);
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div>
      <Box className="styled-container">
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ marginTop: "60px" }}
            />
        
        <Box className="styled-header">
          <Typography className="header-title" variant="h6">EDIT PROFILE</Typography>
          <IconButton className="close-button" onClick={() => setShowProfileEditCard(false)}>
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
                <Typography className="left-label">Name</Typography>
                <TextField
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Your Name"
                />
                <Typography className="left-label">E-Mail</Typography>
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Mail ID"
                  type="email"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography className="right-label">Phone Number</Typography>
                <TextField
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Your Number"
                  inputProps={{ maxLength: 10 }}
                />
                <Typography className="right-label">Emergency Contact</Typography>
                <TextField
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Emergency Contact"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} mt={2}>
              <Typography className="left-label">Address</Typography>
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
              <Button variant="contained" className="gradient-button" onClick={handleSubmit}>
                UPDATE
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default RiderEditProfile;