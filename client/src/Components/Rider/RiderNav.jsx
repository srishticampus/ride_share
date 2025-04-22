import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { IconButton } from '@mui/material';
import Logo from '../../Assets/Logo1.png'

export default function RiderNav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '2' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'right' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button color="inherit" >HOME</Button>
            <Button color="inherit" >RIDE</Button>
            <Button color="inherit">COMPLAINTS</Button>
            <Button color="inherit" >PAYMENT</Button>
            <Button color="inherit" >RIDE HISTORY</Button>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#FFD05A',
                color: 'white',
                marginLeft: '10px'
              }}
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
    </Box>
  );
}