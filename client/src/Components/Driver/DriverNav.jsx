import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem
} from '@mui/material';
import Logo from '../../Assets/Logo1.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function DriverNav({ onAvatarClick }) {

    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
    const [historyAnchorEl, setHistoryAnchorEl] = React.useState(null);
    const historyOpen = Boolean(historyAnchorEl);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleCloseLogoutDialog = () => {
        setOpenLogoutDialog(false);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("driverData");
        localStorage.removeItem("driverToken");
        localStorage.removeItem("driverId");

        toast.success('Driver logged out');

        setOpenLogoutDialog(false);
        setTimeout(() => {
            navigate("/Driver-login");
        }, 2000);
    };

    const handleHistoryClick = (event) => {
        setHistoryAnchorEl(event.currentTarget);
    };

    const handleHistoryClose = () => {
        setHistoryAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '2' }}>

                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to="/driver-home-page" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={Logo} alt="Company Logo" style={{ height: '40px' }} />
                    </Link>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <Button
                            component={Link}
                            to="/driver-home-page"
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
                        <Link
                            to="/driver-Add-Vehicle"
                        >
                            <Button
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        color: '#FFD05A'
                                    }
                                }}
                            >
                                VEHICLE
                            </Button>
                        </Link>
                        <Link to="/driver-Add-Ride">
                            <Button
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        color: '#FFD05A'
                                    }
                                }}

                            >
                                ADD Ride
                            </Button>
                        </Link>

                        <Link to="/driver-View-Requets">
                            <Button
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        color: '#FFD05A'
                                    }
                                }}
                            >
                                RIDE REQUESTS
                            </Button>
                        </Link>

                        <Button
                            component={Link}
                            to="/driver-Add-complaints"
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
                        <Button
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#333',
                                    color: '#FFD05A'
                                }
                            }}
                            onClick={handleHistoryClick}
                            endIcon={<ArrowDropDownIcon />}
                        >
                            HISTORY
                        </Button>
                        <Menu
                            anchorEl={historyAnchorEl}
                            open={historyOpen}
                            onClose={handleHistoryClose}
                            MenuListProps={{ 'aria-labelledby': 'history-button' }}
                        >
                            <MenuItem
                                onClick={handleHistoryClose}
                                component={Link}
                                to="/driver-View-history"
                            >
                                Ride History
                            </MenuItem>
                            <MenuItem
                                onClick={handleHistoryClose}
                                component={Link}
                                to="/driver-View-PaymentHistory"
                            >
                                Payment History
                            </MenuItem>
                        </Menu>

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
        </Box>
    );
}