import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function LandindNav() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '2' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', color: 'white' }}>
                        <Link to='/about' style={{ color: "white" }}> <Button color="white">ABOUT US</Button></Link>
                        <Link to='/contact' style={{ color: "white" }}>  <Button color="inherit" >CONTACT US</Button></Link>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#FFD05A',
                                color: 'white',
                                marginLeft: '10px'
                            }}
                            onClick={handleClick}
                        >
                            LOGIN
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem component={Link} to="/admin-login" onClick={handleClose}>
                                Admin
                            </MenuItem>
                            <MenuItem component={Link} to="/User-login" onClick={handleClose}>
                               
                                Rider
                            </MenuItem>
                            <MenuItem component={Link} to="/driver-login" onClick={handleClose}>
                               
                                Driver
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}