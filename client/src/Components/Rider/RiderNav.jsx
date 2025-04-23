import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Logo from '../../Assets/Logo1.png';
import { toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RiderNav() {
  const navigate= useNavigate()
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("riderData")
    toast.success('User logged out');
    setOpenLogoutDialog(false);
    setTimeout(() => {
      navigate("/User-login")
    }, 2000);

  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ToastContainer/>
      <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '2' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'right' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button color="inherit">HOME</Button>
            <Button color="inherit">RIDE</Button>
            <Button color="inherit">COMPLAINTS</Button>
            <Button color="inherit">PAYMENT</Button>
            <Button color="inherit">RIDE HISTORY</Button>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#FFD05A',
                color: 'white',
                marginLeft: '10px'
              }}
              onClick={handleLogoutClick}
            >
              LOGOUT
            </Button>
            <Link to="/User-profile" style={{ color: "white" }}>
              <IconButton color="inherit">
                <AccountCircleOutlinedIcon style={{ color: "#FFFF00" }} />
              </IconButton>
            </Link>
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
            minWidth: '400px',  // Increased width
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          id="alert-dialog-title" 
          style={{ 
            backgroundColor: '#FFFF00', 
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
              color: '#FFFF00',
              border: '2px solid #FFFF00',
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
              backgroundColor: '#FFFF00',
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
    </Box>
  );
}