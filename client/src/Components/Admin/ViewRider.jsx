
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
  InputLabel, 
  Box,
  Typography
} from '@mui/material';
import '../Style/Table.css';
import Service from '../../Services/apiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

  const UserProfile = da.driverPic 
    ? `${imageBaseUrl}${drivers.driverPic}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; 

function ViewRider() {
    const navigate = useNavigate()
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await Service.getAllUsers();
                console.log('API Response:', response);
                
                if (response.data && response.data.users) {
                    setRiders(response.data.users);
                } else {
                    throw new Error('Invalid data format received from API');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching riders:', err);
                const errorMessage = err.response?.data?.message || err.message;
                setError(errorMessage);
                setLoading(false);

                if (err.status === "fail") {
                    toast.error('Session expired. Please login again.');
                    setTimeout(() => {
                        navigate("/admin-login")
                    }, 2000);
                }
            }
        };

        fetchRiders();
    }, []);
    const UserProfile = riders.data.users 
    ? `${imageBaseUrl}${riders.data.users}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; 

    const filteredRiders = riders.filter(rider =>
        rider.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.phoneNumber?.toString().includes(searchQuery)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRiders = filteredRiders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setCurrentPage(1); 
    };

console.log(import.meta.env.VITE_API_URL);

    if (loading) {
        return (
            <div className="admin-dashboard-container">
                <AdminNav />
                <AdminSidemenu />
                <div className="dashboard-main-content">
                    <h1 className='drivers-title'>RIDERS</h1>
                    <div className='container-search'>
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                    <div className="loading-message">Loading riders...</div>
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
                    <h1 className='drivers-title'>RIDERS</h1>
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
                <h1 className='drivers-title'>RIDERS</h1>
                <div className='container-search'>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <h3>View All RIDERS</h3>

                <div className="riders-table-container">
                    <table className="riders-table">
                        <thead>
                            <tr>
                                <th>SL NO</th>
                                <th>Name</th>
                                <th>Profile Pic</th>
                                <th>Email ID</th>
                                <th>Phone No</th>
                                <th>Address</th>
                                <th>Emergency Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRiders.map((rider, index) => (
                                <tr key={rider._id || index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{rider.fullName}</td>
                                    <td>
                                        <Avatar
                                            src={UserProfile}
                                            alt={rider.fullName}
                                            sx={{ width: 40, height: 40 }}
                                        >
                                        </Avatar>
                                    </td>
                                    <td>{rider.email}</td>
                                    <td>{rider.phoneNumber}</td>
                                    <td>{rider.address}</td>
                                    <td>{rider.emergencyNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRiders.length === 0 && (
                        <div className="no-results">No riders found matching your search criteria</div>
                    )}
                </div>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'right', 
                    alignItems: 'center', 
                    mt: 3,
                    p: 2,
                    borderRadius: 1,
                    gap:6
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            Riders per page:
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
                        Per Page {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRiders.length)} of {filteredRiders.length}
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

export default ViewRider;
