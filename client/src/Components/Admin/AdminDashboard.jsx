import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import PersonIcon from '@mui/icons-material/Person';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import RouteIcon from '@mui/icons-material/Route';
import '../Style/AdminDashboard.css'; 
import apiService from '../../Services/apiService';

function AdminDashboard() {
const [ride, setRide] = useState(0)
const [riders, setRiders] = useState(0)
const [drivers, setDiver] = useState(0)


  useEffect(() => {
    const fetchride = async () => {
      try {
        const response = await apiService.getAllRides();
        console.log(response);
        setRide(response.results)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
const fetchRiders = async ()=>{
  try {
    const response = await apiService.getAllUsers();
    console.log(response);
    setRiders(response.results)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
const fetchDrivers = async () => {
  try {
    const response = await apiService.getAllDrivers();
    console.log(response.results);
    setDiver(response.results)
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
}
    fetchDrivers();
    fetchride();
    fetchRiders()
  }, [])
  
  return (
    <div className="admin-dashboard-container">
      <AdminNav/>
      <AdminSidemenu/>
      <div className="stats-container">
        <div className='stat-box all-riders'>
          <div className="icon-circle">
            <PersonIcon className="stat-icon"/>
          </div>
          <div className="stat-content">
            <h3>RIDERS</h3>
            <p>{riders}</p>
          </div>
        </div>
        
        <div className='stat-box all-drivers'>
          <div className="icon-circle">
            <LocalTaxiIcon className="stat-icon"/>
          </div>
          <div className="stat-content">
            <h3>DRIVERS</h3>
            <p>{drivers}</p>
          </div>
        </div>
        
        <div className='stat-box all-trips'>
          <div className="icon-circle">
            <RouteIcon className="stat-icon"/>
          </div>
          <div className="stat-content">
            <h3>TRIPS</h3>
            <p>{ride}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;