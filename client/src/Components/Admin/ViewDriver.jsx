import React, { useEffect, useState } from 'react';
import AdminSidemenu from './AdminSidemenu';
import AdminNav from './AdminNav';
import '../Style/ViewDriver.css';
import SearchBar from './SearchBar';
import { Avatar } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Service from '../../Services/apiService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { imageBaseUrl} from '../../Services/apiService';

function ViewDriver() {
    const [drivers, setDrivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDriverId, setExpandedDriverId] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await Service.getAllDrivers();
                console.log(response);

                if (response.data && response.data.drivers) {
                    const verifiedDrivers = response.data.drivers.filter(
                        driver => driver.backgroundCheck === true
                    );
                    setDrivers(verifiedDrivers);
                }
            } catch (err) {
                console.error('Error fetching riders:', err);
                const errorMessage = err.response?.data?.message || err.message;
                // setLoading(false);

                if (err.status === "fail") {
                    toast.error('Session expired. Please login again.');
                }
            }
        };

        fetchDrivers();
    }, []);
  const UserProfile = drivers.driverPic 
    ? `${imageBaseUrl}${drivers.driverPic}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; 

    const toggleExpand = (driverId) => {
        if (expandedDriverId === driverId) {
            setExpandedDriverId(null);
        } else {
            setExpandedDriverId(driverId);
        }
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phoneNumber?.toString().includes(searchQuery)
    );

    return (
        <div className="admin-dashboard-container">
            <ToastContainer />

            <AdminNav />
            <AdminSidemenu />

            <div className="dashboard-main-content">
                <h1 className='drivers-title'>DRIVERS</h1>
                <div className='container-search'>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>
                <h3>View All Drivers</h3>
                <div className="content-wrapper">
                    {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                            <div 
                                key={driver._id} 
                                className="driver-card"
                                style={{ 
                                    height: expandedDriverId === driver._id ? 'auto' : '180px',
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="driver-main-content">
                                    <div className="avatar-container">
                                        <Avatar
                                            alt={driver.fullname}
                                            src={UserProfile}
                                            sx={{ width: 120, height: 120 }}
                                        />
                                    </div>

                                    <div className="text-container">
                                        <h3>{driver.fullname}</h3>
                                        <div className="contact-info">
                                            <EmailOutlinedIcon style={{ fontSize: 20, marginRight: 8 }} />
                                            <span>{driver.email}</span>
                                        </div>
                                        <div className="contact-info">
                                            <LocalPhoneOutlinedIcon style={{ fontSize: 20, marginRight: 8 }} />
                                            <span>{driver.phoneNumber}</span>
                                        </div>
                                        
                                        <div 
                                            className="view-details-link"
                                            onClick={() => toggleExpand(driver._id)}
                                        >
                                            {expandedDriverId === driver._id ? (
                                                <>
                                                    <span>Hide Details</span>
                                                    <ExpandLessIcon />
                                                </>
                                            ) : (
                                                <>
                                                    <span>View Details</span>
                                                    <ExpandMoreIcon />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {expandedDriverId === driver._id && (
                                    <div className="driver-details-expanded">
                                        <div className="detail-row">
                                            <span className="detail-label">License Number:</span>
                                            <span className="detail-value">{driver.licenseNumber}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Vehicle Reg Number:</span>
                                            <span className="detail-value">{driver.vehicleRegNumber}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Background Check:</span>
                                            <span className="detail-value">
                                                {driver.backgroundCheck ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Account Status:</span>
                                            <span className="detail-value">
                                                {driver.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        {/* <div className="detail-row">
                                            <span className="detail-label">Created At:</span>
                                            <span className="detail-value">
                                                {new Date(driver.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Last Updated:</span>
                                            <span className="detail-value">
                                                {new Date(driver.updatedAt).toLocaleString()}
                                            </span>
                                        </div> */}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-drivers">
                            {drivers.length === 0
                                ? "No drivers available"
                                : "No drivers match your search"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewDriver;