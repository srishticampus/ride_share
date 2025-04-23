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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function DriverNav() {
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
            <ToastContainer />
            <AppBar position="fixed" style={{ backgroundColor: 'black', zIndex: '2' }}>

                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to="/driver-home-page" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={Logo} alt="Company Logo" style={{ height: '40px' }} />
                    </Link>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <Button
                            color="inherit"
                            component={Link}
                            // to="/Driver-home"
                            style={{ color: 'white' }}
                        >
                            HOME
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            // to="/Ride-requests"
                            style={{ color: 'white' }}
                        >
                            RIDE REQUESTS
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/Complaints"
                            style={{ color: 'white' }}
                        >
                            COMPLAINTS
                        </Button>
                        <Button
                            color="inherit"
                            style={{ color: 'white' }}
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
                                // to="/Ride-history"
                            >
                                Ride History
                            </MenuItem>
                            <MenuItem
                                onClick={handleHistoryClose}
                                component={Link}
                                // to="/Payment-history"
                            >
                                Payment History
                            </MenuItem>
                        </Menu>

                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#FFD05A',
                                color: 'white',
                                marginLeft: '10px',
                                fontWeight: 'bold'
                            }}
                            onClick={handleLogoutClick}
                        >
                            LOGOUT
                        </Button>
                        <Link to="/Driver-profile" style={{ color: "white" }}>
                            <IconButton color="inherit">
                                <AccountCircleOutlinedIcon style={{ color: "#FFFF00", fontSize: '32px' }} />
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
                        minWidth: '400px',
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