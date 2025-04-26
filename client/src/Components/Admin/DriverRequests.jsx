import React, { useState, useEffect } from 'react';
import AdminSidemenu from './AdminSidemenu';
import AdminNav from './AdminNav';
import '../Style/ViewDriver.css';
import SearchBar from './SearchBar';
import { 
  Avatar, 
  Pagination, 
  Select, 
  MenuItem, 
  FormControl, 
  Box,
  Typography,
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import '../Style/Table.css';
import Service from '../../Services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function DriverRequests() {
    const navigate = useNavigate();
    const [allDrivers, setAllDrivers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await Service.getAllDrivers();
                console.log('API Response:', response);
                
                if (response.data && response.data.drivers) {
                    setAllDrivers(response.data.drivers);
                    // Filter only drivers with backgroundCheck: false
                    const pendingDrivers = response.data.drivers.filter(
                        driver => driver.backgroundCheck === false
                    );
                    setDrivers(pendingDrivers);
                } else {
                    throw new Error('Invalid data format received from API');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching drivers:', err);
                const errorMessage = err.response?.data?.message || err.message;
                setError(errorMessage);
                setLoading(false);

                if (err.response?.data?.status === "fail") {
                    toast.error('Session expired. Please login again.');
                    setTimeout(() => {
                        navigate("/admin-login");
                    }, 2000);
                }
            }
        };

        fetchDrivers();
    }, []);

    const handleAccept = async (driverId) => {
        try {
            const response = await Service.approveDriver(driverId, true); 
            console.log('Accept Response:', response);
            toast.success('Driver accepted successfully');
            
            setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));
        } catch (error) {
            console.error('Error accepting driver:', error);
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(`Error accepting driver: ${errorMessage}`);
        }
    };
    
    const handleReject = async (driverId) => {
        try {
            const response = await Service.rejectDriver(driverId); 
            console.log('Reject Response:', response);
            toast.success('Driver rejected successfully');
    
            setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));
        } catch (error) {
            console.error('Error rejecting driver:', error);
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(`Error rejecting driver: ${errorMessage}`);
        }
    };
        const filteredDrivers = drivers.filter(driver =>
        driver.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phoneNumber?.toString().includes(searchQuery)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setCurrentPage(1); 
    };

    const getProfileImageUrl = (driverPic) => {
        if (!driverPic) return null;
        return `${import.meta.env.VITE_API_URL}${driverPic}`;
    };

    if (loading) {
        return (
            <div className="admin-dashboard-container">
                <ToastContainer/>
                <AdminNav />
                <AdminSidemenu />
                <div className="dashboard-main-content">
                    <h1 className='drivers-title'>DRIVER REQUESTS</h1>
                    <div className='container-search'>
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                    <div className="loading-message">Loading drivers...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-container">
                <AdminNav />
                <AdminSidemenu />
                <div className="dashboard-main-content">
                    <h1 className='drivers-title'>P</h1>
                    <div className='container-search'>
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                    <div className="error-message">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <AdminNav />
            <AdminSidemenu />

            <div className="dashboard-main-content">
                <h1 className='drivers-title'>DRIVER REQUESTS</h1>
                <div className='container-search'>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <h3>View All Drivers Requests</h3>

                <div className="riders-table-container">
                    <table className="riders-table">
                        <thead>
                            <tr>
                                <th>SL NO</th>
                                <th>Name</th>
                                <th>Profile Pic</th>
                                <th>Email ID</th>
                                <th>Phone No</th>
                                <th>License Number</th>
                                <th>Vehicle Reg No</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((driver, index) => (
                                <tr key={driver._id || index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{driver.fullname}</td>
                                    <td>
                                        <Avatar
                                            src={getProfileImageUrl(driver.driverPic)}
                                            alt={driver.fullname}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    </td>
                                    <td>{driver.email}</td>
                                    <td>{driver.phoneNumber}</td>
                                    <td>{driver.licenseNumber}</td>
                                    <td>{driver.vehicleRegNumber}</td>
                                    <td>
                                        <IconButton 
                                            color="success" 
                                            onClick={() => handleAccept(driver._id)}
                                            aria-label="accept"
                                        >
                                            <CheckCircleIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleReject(driver._id)}
                                            aria-label="reject"
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredDrivers.length === 0 && (
                        <div className="no-results">No pending driver verifications found</div>
                    )}
                </div>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'right', 
                    alignItems: 'center', 
                    mt: 3,
                    p: 2,
                    borderRadius: 1,
                    gap: 6
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            Items per page:
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Items per page' }}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Typography variant="body2">
                        Page {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDrivers.length)} of {filteredDrivers.length}
                    </Typography>
                    <Pagination 
                        count={totalPages} 
                        page={currentPage} 
                        onChange={handlePageChange} 
                        shape="rounded" 
                        color="primary"
                        showFirstButton
                        showLastButton
                        sx={{ 
                            '& .MuiPaginationItem-root': {
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                </Box>
            </div>
        </div>
    );
}

export default DriverRequests;