import React, { useRef, useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService, { imageBaseUrl } from '../../Services/apiService';
import { useNavigate } from 'react-router-dom';
const DriverEditProfile = ({ setShowProfileEditCard, currentDriver, setCurrentDriver,fetchDriverData }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullname: currentDriver.fullname || "",
    email: currentDriver.email || "",
    phoneNumber: currentDriver.phoneNumber || "",
    vehicleRegNumber: currentDriver.vehicleRegNumber || "",
    driverPic: null
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    vehicleRegNumber: ""
  });

  const [avatarSrc, setAvatarSrc] = useState(
    currentDriver.driverPic
      ?`${imageBaseUrl}uploads/drivers/${currentDriver.driverPic}`
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
      setFormData(prev => ({ ...prev, driverPic: file }));
    }
  };

  const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateVehicleReg = (reg) => {
    // Basic validation - can be enhanced based on your country's vehicle registration format
    return reg.length >= 6 && reg.length <= 15;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation
    let error = "";
    if (name === "fullname") {
      if (!validateName(value)) {
        error = "Name should contain only alphabets";
      }
    } else if (name === "phoneNumber") {
      if (!validatePhone(value)) {
        error = "Phone number must be 10 digits";
      }
    } else if (name === "email") {
      if (!validateEmail(value)) {
        error = "Please enter a valid email";
      }
    } else if (name === "vehicleRegNumber") {
      if (!validateVehicleReg(value)) {
        error = "Please enter a valid registration number";
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Final validation before submit
  let isValid = true;
  const newErrors = { ...errors };

  if (!validateName(formData.fullname)) {
    newErrors.fullname = "Name should contain only alphabets";
    isValid = false;
  }

  if (!validatePhone(formData.phoneNumber)) {
    newErrors.phoneNumber = "Phone number must be 10 digits";
    isValid = false;
  }

  if (!validateEmail(formData.email)) {
    newErrors.email = "Please enter a valid email";
    isValid = false;
  }

  if (!validateVehicleReg(formData.vehicleRegNumber)) {
    newErrors.vehicleRegNumber = "Please enter a valid registration number";
    isValid = false;
  }

  setErrors(newErrors);

  if (!isValid) {
    toast.error("Please fix the errors in the form");
    return;
  }

  try {
    const formDataToSend = new FormData();

    formDataToSend.append('fullname', formData.fullname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('vehicleRegNumber', formData.vehicleRegNumber);

    if (formData.driverPic) {
      formDataToSend.append('driverPic', formData.driverPic);
    }

    const response = await apiService.updateCurrentDriver(formDataToSend); // Make sure to use formDataToSend here

if (response.status === 'success') {
  await fetchDriverData(); // This will refetch fresh data from the server
  toast.success('Profile updated successfully!');
  setTimeout(() => setShowProfileEditCard(false), 1500);
} else {
      throw new Error(response.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Update error:', error);

    if (error.response?.data?.message?.includes('E11000 duplicate key error') &&
      error.response?.data?.message?.includes('phoneNumber')) {
      toast.error('This phone number is already registered', {
        autoClose: 3000
      });
    } else {
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile', {
        autoClose: 3000
      });
    }
  }
};

  return (
    <Box className="styled-container">
      <Box className="styled-header">
        <Typography className="header-title-edit" variant="h6">EDIT PROFILE</Typography>
        <IconButton className="close-button" onClick={() => setShowProfileEditCard(false)}>
          <CloseIcon className="close-button"/>
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
          {/* <Typography className="name-text" variant="h6">{formData.fullname}</Typography> */}
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
                error={!!errors.fullname}
                helperText={errors.fullname}
                required
                inputProps={{
                  pattern: "[A-Za-z\\s]+",
                  title: "Name should contain only alphabets"
                }}
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
                error={!!errors.email}
                helperText={errors.email}
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
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                required
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]{10}",
                  maxLength: 10,
                  title: "Phone number must be 10 digits"
                }}
              />

              <Typography className="right-label" variant="body1">Vehicle Registration Number</Typography>
              <TextField
                name="vehicleRegNumber"
                value={formData.vehicleRegNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter Vehicle Registration Number"
                className="styled-textfield"
                error={!!errors.vehicleRegNumber}
                helperText={errors.vehicleRegNumber}
                required
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