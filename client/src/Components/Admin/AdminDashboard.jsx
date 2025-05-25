import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import PersonIcon from '@mui/icons-material/Person';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import RouteIcon from '@mui/icons-material/Route';
import '../Style/AdminDashboard.css'; 
import apiService from '../../Services/apiService';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [rides, setRides] = useState([]); // Changed from ride to rides to store the array
  const [riders, setRiders] = useState(0);
  const [drivers, setDrivers] = useState(0);

  useEffect(() => {
    const fetchride = async () => {
      try {
        const response = await apiService.getAllRides();
        console.log(response);
        setRides(response.data.rides); // Assuming the rides array is in response.data.rides
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchRiders = async () => {
      try {
        const response = await apiService.getAllUsers();
        console.log(response);
        setRiders(response.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await apiService.getAllDrivers();
        console.log(response.results);
        setDrivers(response.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDrivers();
    fetchride();
    fetchRiders();
  }, []);

  const completedRidesCount = rides.filter(ride => ride.status === "completed").length;

  return (
    <div className="admin-dashboard-container">
      <AdminNav/>
      <AdminSidemenu/>
      <div className="stats-container">
        <Link to="/admin-view-riders" style={{ textDecoration: 'none' }}>
          <div className='stat-box all-riders'>
            <div className="icon-circle">
              <PersonIcon className="stat-icon"/>
            </div>
            <div className="stat-content">
              <h3>RIDERS</h3>
              <p>{riders}</p>
            </div>
          </div>
        </Link>
       
        <Link to="/admin-view-driver" style={{ textDecoration: 'none' }}>
          <div className='stat-box all-drivers'>
            <div className="icon-circle">
              <LocalTaxiIcon className="stat-icon"/>
            </div>
            <div className="stat-content">
              <h3>DRIVERS</h3>
              <p>{drivers}</p>
            </div>
          </div>
        </Link>
       
        <Link to='/admin-ride-history' style={{ textDecoration: 'none' }}>
          <div className='stat-box all-trips'>
            <div className="icon-circle">
              <RouteIcon className="stat-icon"/>
            </div>
            <div className="stat-content">
              <h3>TRIPS</h3>
              <p>{completedRidesCount}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;