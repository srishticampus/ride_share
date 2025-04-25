import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../Assets/RideShare.png';

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
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Link to="/">
                            <img
                                src={Logo}
                                alt="RideShare Logo"
                                style={{
                                    height: '50px',
                                    marginRight: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                        </Link>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                        color: 'white',
                        flexGrow: 1,
                        justifyContent: 'right'
                    }}>
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            <Button
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        color: '#FFD05A',
                                    }
                                }}
                            >
                                Home
                            </Button>
                        </Link>
                        <Link to='/about' style={{ textDecoration: 'none' }}>
                            <Button
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        color: '#FFD05A',
                                    }
                                }}
                            >
                                ABOUT US
                            </Button>
                        </Link>
                        <Link to='/contact' style={{ textDecoration: 'none' }}>
                            <Button
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        color: '#FFD05A',
                                    }
                                }}
                            >
                                CONTACT US
                            </Button>
                        </Link>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'right' }}>
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
                            onClick={handleClick}
                        >
                            LOGIN
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}

                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem
                                component={Link}
                                to="/admin-login"
                                onClick={handleClose}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        color: '#1976d2',
                                    }
                                }}
                            >
                                Admin
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to="/User-login"
                                onClick={handleClose}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        color: '#1976d2',
                                    }
                                }}
                            >
                                Rider
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to="/driver-login"
                                onClick={handleClose}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        color: '#1976d2',
                                    }
                                }}
                            >
                                Driver
                            </MenuItem>

                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}