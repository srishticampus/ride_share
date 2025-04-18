import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { IconButton } from '@mui/material';
export default function AdminNav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: '#D8D8D8', color: 'black',zIndex:'2' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'end',gap:"10px" }}>
        <IconButton color="inherit"><NotificationsNoneOutlinedIcon/></IconButton>
          <IconButton color="inherit"><AccountCircleOutlinedIcon/></IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
