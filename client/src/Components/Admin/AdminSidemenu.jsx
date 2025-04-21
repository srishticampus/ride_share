import React, { useState } from 'react';
import {
    Avatar, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, List, ListItem,
    ListItemIcon, ListItemText, Collapse, Typography
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    History as HistoryIcon,
    ErrorOutline as ErrorOutlineIcon,
    ExpandLess,
    ExpandMore
} from '@mui/icons-material';
import Logo from '../../Assets/RideShare.png';
import '../Style/AdminSidemenu.css';

function AdminSidemenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState({});

    const menuItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
        {
            name: 'Manage Users',
            icon: <PersonIcon />,
            subItems: [
                { name: 'View All Drivers', path: '/admin-view-driver' },
                { name: 'View All Riders', path: '/admin-view-riders' }
            ]
        },
        { name: 'Complaints', icon: <ErrorOutlineIcon />, path: '#' },
        { name: 'Ride History', icon: <HistoryIcon />, path: '#' },
        { name: 'Logout', icon: <LogoutIcon />, action: () => setOpenLogoutDialog(true) }
    ];

    const isActive = (path) => {
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    };

    const handleSubmenuToggle = (name) => {
        setOpenSubmenu(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleLogout = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className='sidemenu-container'>
            <div className='Admin-card'>
                <img
                    src={Logo}
                    alt="Logo"
                    className='logo'
                    style={{ width: 130, height: 130, display: 'block' }}
                />

                <Typography variant="h6" align="center">
                    Admin Panel
                </Typography>
            </div>

            <List component="nav" className='sidemenu-options'>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {item.subItems ? (
                            <>
                                <ListItem
                                    button
                                    onClick={() => handleSubmenuToggle(item.name)}
                                    className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                                >
                                    <ListItemIcon sx={{ color: 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {openSubmenu[item.name] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openSubmenu[item.name]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <ListItem
                                                button
                                                component={Link}
                                                to={subItem.path}
                                                key={subIndex}
                                                className={`submenu-item ${isActive(subItem.path) ? 'active-sub' : ''}`}
                                                sx={{ pl: 4 }}
                                            >
                                                <ListItemText primary={subItem.name} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) : item.action ? (
                            <ListItem
                                button
                                onClick={item.action}
                                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        ) : (
                            <ListItem
                                button
                                component={Link}
                                to={item.path}
                                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        )}
                    </div>
                ))}
            </List>

            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                PaperProps={{
                    sx: {
                        width: '350px',
                        borderRadius: '16px',
                        padding: '20px'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "24px",
                        paddingBottom: '10px',
                        color: 'black'
                    }}
                >
                    Confirm Logout
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ fontSize: '18px' }}>
                        Are you sure you want to logout?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: '20px', padding: '20px' }}>
                    <Button
                        onClick={() => setOpenLogoutDialog(false)}
                        variant="outlined"
                        sx={{ minWidth: '100px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="error"
                        variant="contained"
                        sx={{ minWidth: '100px' }}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AdminSidemenu;