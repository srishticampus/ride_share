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

function ViewDriver() {
    const [drivers, setDrivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
                            <div key={driver._id} className='driver-card'>
                                <div className="avatar-container">
                                    <Avatar
                                        alt={driver.fullname}
                                        src={`http://localhost:4052/ride_share_api/${driver.driverPic}`}
                                        sx={{ width: 120, height: 120 }}
                                    >
                                    </Avatar>
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
                                </div>
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