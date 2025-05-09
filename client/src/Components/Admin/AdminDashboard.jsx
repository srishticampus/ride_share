import React from 'react';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import PersonIcon from '@mui/icons-material/Person';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import RouteIcon from '@mui/icons-material/Route';
import '../Style/AdminDashboard.css'; 

function AdminDashboard() {
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
            <p>20,000</p>
          </div>
        </div>
        
        <div className='stat-box all-drivers'>
          <div className="icon-circle">
            <LocalTaxiIcon className="stat-icon"/>
          </div>
          <div className="stat-content">
            <h3>DRIVERS</h3>
            <p>20,000</p>
          </div>
        </div>
        
        <div className='stat-box all-trips'>
          <div className="icon-circle">
            <RouteIcon className="stat-icon"/>
          </div>
          <div className="stat-content">
            <h3>TRIPS</h3>
            <p>10,000</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;