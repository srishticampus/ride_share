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
import { FaTimes } from 'react-icons/fa';
import '../Style/RiderRideHistory.css';
import DriverNav from './DriverNav';
import apiService from '../../Services/apiService';
import { toast } from 'react-toastify';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';

function DriverRideHistory() {
  // Ride History States
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

  // Profile Management States
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentDriver, setCurrentDriver] = useState({});

  // Profile Functions
  const onAvatarClick = () => {
    setShowProfileCard(prev => !prev);
    setShowProfileEditCard(false);
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

  // Ride History Functions
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllRides();
        if (response.status === 'success') {
          setAllRides(response.data.rides);
          const driverRides = response.data.rides.filter(ride =>
            ride.VehicleId?.driverId?._id === driverId
          );
          setAcceptedRides(driverRides.filter(ride =>
            (ride.status === 'accepted' || ride.status === 'pending') &&
            ride.acceptedRiderId?.length > 0
          ));
          setCompletedRides(driverRides.filter(ride =>
            ride.status === 'completed'
          ));
        }
      } catch (err) {
        console.error('Error fetching rides:', err);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) fetchRides();
  }, [driverId]);

  useEffect(() => {
    fetchDriverData();
  }, []);

  useEffect(() => {
    if (selectedRide) setLocalMessages(selectedRide.messages || []);
  }, [selectedRide]);

  const handleViewMore = (ride) => setSelectedRide(ride);

  const handleOpenChat = () => setShowChatModal(true);
  const handleCloseChat = () => {
    setShowChatModal(false);
    setError(null);
  };

  const handleSendMessage = async () => {
    setError(null);
    try {
      if (!message.trim()) return setError('Message cannot be empty');
      if (!selectedRide?._id) return setError('No ride selected');

      const tempMessage = {
        text: message,
        sender: { _id: driverId, fullName: driverName || 'You' },
        senderType: 'Driver',
        createdAt: new Date().toISOString()
      };

      setLocalMessages(prev => [...prev, tempMessage]);
      setMessage('');

      await apiService.updateRideMessage(
        selectedRide._id,
        message.trim(),
        driverId,
        true
      );

      setAllRides(prev => prev.map(ride =>
        ride._id === selectedRide._id ? 
        { ...ride, messages: [...(ride.messages || []), tempMessage] } : ride
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      setLocalMessages(prev => prev.slice(0, -1));
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      setLoading(true);
      setAcceptedRides(prev => prev.map(ride =>
        ride._id === rideId ? { ...ride, status: 'accepted' } : ride
      ));
      await apiService.acceptRide(rideId, driverId);
      toast.success("Accepted Successfully");
    } catch (err) {
      console.error('Error accepting ride:', err);
      setAcceptedRides(prev => prev.map(ride =>
        ride._id === rideId ? { ...ride, status: 'pending' } : ride
      ));
      toast.error("Accept Failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatDateTime = (dateString, timeString) => 
    `${formatDate(dateString)}, ${timeString}`;

  const getSenderName = (message) => 
    message.senderType === 'Driver' ? 'You' : 
    selectedRide?.acceptedRiderId?.find(r => r._id === message.sender?._id)?.fullName || 'Passenger';

  const renderRideList = (rides) => {
    if (loading) return <Typography variant="body1" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>Loading rides...</Typography>;
    return rides.length > 0 ? rides.map((ride) => (
      <div key={ride._id} className={`ride-card ${selectedRide?._id === ride._id ? 'selected' : ''}`} onClick={() => handleViewMore(ride)}>
        <div className="ride-icon"><HistoryIcon /></div>
        <div className="ride-info">
          <div>
            <h4>Ride ID: {ride._id.slice(-6).toUpperCase()}</h4>
            <p>From: {ride.origin}</p>
            <p>To: {ride.destination}</p>
            <p>Fare: ₹{ride.price}</p>
            <p>Date: {formatDate(ride.rideDate)}</p>
          </div>
          {tabValue === 0 && ride.status === 'pending' && (
            <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleAcceptRide(ride._id); }}
              sx={{ backgroundColor: '#4CAF50', minWidth: '120px', '&:hover': { backgroundColor: '#388E3C' }}}>
              Accept Ride
            </Button>
          )}
        </div>
      </div>
    )) : <Typography variant="body1" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>No rides found</Typography>;
  };

  return (
    <div className="rider-ride-history-container">
      <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />

      {/* Profile Components */}
      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{ position: "absolute", top: "40px", right: "20px", zIndex: 2 }}>
            <DriverViewProfile onEditClick={onEditClick} driver={currentDriver} />
          </div>
        </ClickAwayListener>
      )}

      {showProfileEditCard && (
        <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
          <div style={{ 
            position: "absolute", 
            top: "10vh", 
            left: "50%", 
            transform: "translateX(-50%)",
            backgroundColor: "white", 
            zIndex: 5, 
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
        <div className="ride-history-header">
          <h2>RIDE HISTORY</h2>
          <div className="header-actions">
            <h4>Your Ride History</h4>
          </div>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
            <Tab label="Accepted Requests" />
            <Tab label="Completed Rides" />
          </Tabs>
        </Box>

        <div className="ride-history-main split-view">
          <div className="ride-list-container">
            <div className="ride-list">
              {tabValue === 0 ? renderRideList(acceptedRides) : renderRideList(completedRides)}
            </div>
          </div>

          <div className="ride-details-container">
            {selectedRide ? (
              <div className="ride-details">
                <div className="details-header">
                  <h3>RIDE DETAILS</h3>
                  <Button variant="contained" style={{ backgroundColor: '#F1B92E', color: 'black' }} onClick={handleOpenChat}>
                    Chat
                  </Button>
                </div>

                {/* Ride Details Sections (Same as before) */}
                {/* ... */}

              </div>
            ) : (
              <div className="no-ride-selected">
                <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', mt: 10 }}>
                  Select a ride to view details
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Dialog */}
      <Dialog open={showChatModal} onClose={handleCloseChat} fullWidth maxWidth="sm">
        <DialogTitle style={{ color: "#F1B92E" }}>
          CHAT WITH PASSENGER
          <IconButton onClick={handleCloseChat} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Chat Messages */}
          <Box sx={{ height: 300, overflow: 'auto', mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {localMessages.map((msg, index) => (
              <Box key={index} sx={{ 
                mb: 1, p: 1, maxWidth: '80%',
                alignSelf: getSenderName(msg) === 'You' ? 'flex-end' : 'flex-start',
                bgcolor: getSenderName(msg) === 'You' ? '#e3f2fd' : '#f1f1f1',
                borderRadius: 2,
                borderBottomRightRadius: getSenderName(msg) === 'You' ? 0 : 2,
                borderBottomLeftRadius: getSenderName(msg) === 'You' ? 2 : 0
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {getSenderName(msg)}
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'right' }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
          </Box>

          <TextField
            label="Your Message"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button fullWidth variant="contained" sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#e69100' } }} 
            onClick={tabValue === 1 ? handleCloseChat : handleSendMessage}>
            {tabValue === 1 ? 'Close Chat' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DriverRideHistory;