import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { IconButton } from '@mui/material';

export default function LoginNav() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '2' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', color: 'white' }}>
                        <Link to='/about' style={{ color: "white" }}> <Button color="white">ABOUT US</Button></Link>
                        <Link to='/contact' style={{ color: "white" }}>  <Button color="inherit" >CONTACT US</Button></Link>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link to='/User-login'>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: '#FFD05A',
                                    color: 'white',
                                    marginLeft: '10px'
                                }}
                            >
                                LOGIN
                            </Button>

                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}