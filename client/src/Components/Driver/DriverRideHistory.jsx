import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Divider, 
  IconButton, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Avatar,
  ClickAwayListener
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { FaTimes, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import '../Style/RiderRideHistory.css';
import DriverNav from '../Driver/DriverNav';
import apiService from '../../Services/apiService';
import { toast } from 'react-toastify';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';

function DriverRideHistory() {
  const [allRides, setAllRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const driverId = localStorage.getItem('driverId');
  const driverName = localStorage.getItem('driverName');
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentDriver, setCurrentDriver] = useState({});

  // Profile related functions
  const onAvatarClick = () => {
    setShowProfileCard(prev => !prev);
    if (!showProfileCard) {
      setShowProfileEditCard(false);
    }
  };

  const onEditClick = () => {
    setShowProfileEditCard(true);
    setShowProfileCard(false);
  };

  const fetchDriverData = async () => {
    try {
      const driverData = await apiService.getCurrentDriver();
      setCurrentDriver(driverData.data.driver);
      localStorage.setItem("driverData", JSON.stringify(driverData.data.driver));
    } catch (error) {
      console.error("Failed to load driver data:", error);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  // Existing ride history code
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllRides();
        console.log(response);

        if (response.status === 'success') {
          setAllRides(response.data.rides);
          const driverRides = response.data.rides.filter(ride =>
            ride.VehicleId?.driverId?._id === driverId
          );
          const accepted = driverRides.filter(ride =>
            (ride.status === 'accepted' || ride.status === 'pending') &&
            ride.acceptedRiderId?.length > 0
          );
          setAcceptedRides(accepted);
          const completed = driverRides.filter(ride =>
            ride.status === 'completed'
          );
          setCompletedRides(completed);
        }
      } catch (err) {
        console.error('Error fetching rides:', err);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchRides();
    }
  }, [driverId]);

  // Rest of the existing code remains the same...

  return (
    <div className="rider-ride-history-container">
      <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />
      {/* Profile View Card */}
      {showProfileCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{ position: "absolute", top: "40px", right: "20px" }}>
            <DriverViewProfile onEditClick={onEditClick} driver={currentDriver} />
          </div>
        </ClickAwayListener>
      )}

      {/* Profile Edit Card */}
      {showProfileEditCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
          <div style={{ 
            position: "absolute", 
            top: "10vh", 
            left: "50%", 
            transform: "translateX(-50%)",
            backgroundColor: "white", 
            zIndex: "5", 
            borderRadius: "25px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
          }}>
            <DriverEditProfile
              setShowProfileEditCard={setShowProfileEditCard}
              currentDriver={currentDriver}
              setCurrentDriver={setCurrentDriver}
              fetchDriverData={fetchDriverData}
            />
          </div>
        </ClickAwayListener>
      )}

      <div className="ride-history-content">
        {/* Existing ride history content remains the same */}
      </div>

      {/* Chat Dialog (existing code remains the same) */}
    </div>
  );
}

export default DriverRideHistory;