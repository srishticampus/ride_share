import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Logo from '../../Assets/Logo1.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RiderViewProfile from './RiderViewProfile';

export default function RiderNav({onAvatarClick}) {
  const navigate = useNavigate()
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("UserInfo")
        localStorage.removeItem("authToken")
        localStorage.removeItem("riderId")

    toast.success('User logged out');
    setOpenLogoutDialog(false);
    setTimeout(() => {
      navigate("/User-login")
    }, 2000);

  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ToastContainer />
      <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '10' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'right' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to='/User-home-page'>
            <Button
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                  color: '#FFD05A'
                }
              }}
            >
              HOME
            </Button>

            </Link>
            <Link to="/User-View-Ride">
            <Button
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                  color: '#FFD05A'
                }
              }}
            >
              RIDE
            </Button>

            </Link>
            <Link to="/User-Complaints">
            <Button
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                  color: '#FFD05A'
                }
              }}
            >
              COMPLAINTS
            </Button>


            </Link>
            {/* <Link to="/User-payment">
            <Button
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                  color: '#FFD05A'
                }
              }}
            >
              PAYMENT
            </Button>

            </Link> */}
            <Link to='/User-ride-History'>
            <Button
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                  color: '#FFD05A'
                }
              }}
            >
              RIDE HISTORY
            </Button>
            </Link>
           
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FFD05A',
                color: 'white',
                marginLeft: '10px',
                '&:hover': {
                  backgroundColor: '#e6bb42',
                  color: 'black'
                }
              }}
              onClick={handleLogoutClick}
            >
              LOGOUT
            </Button>
              <IconButton color="inherit" onClick={onAvatarClick}>
                <AccountCircleOutlinedIcon style={{ color: "#FFFF00" }} />
              </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            minWidth: '400px',
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: '#F1B92E',
            color: 'black',
            fontWeight: 'bold',
            padding: '16px 24px'
          }}
        >
          Confirm Logout
        </DialogTitle>
        <DialogContent style={{ backgroundColor: 'white', padding: '20px 24px' }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              color: 'black',
              fontSize: '16px'
            }}
          >
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Button
            onClick={handleCloseLogoutDialog}
            variant="outlined"
            style={{
              color: '#F1B92E',
              border: '2px solid #F1B92E',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '8px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            No
          </Button>
          <Button
            onClick={handleConfirmLogout}
            autoFocus
            variant="contained"
            style={{
              backgroundColor: '#F1B92E',
              color: 'black',
              borderRadius: '8px',
              padding: '8px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'none',
              minWidth: '100px',
              '&:hover': {
                backgroundColor: '#FFD700'
              }
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* {showProfile && <RiderViewProfile onClose={handleCloseProfile} />} */}
    </Box>
  );
}