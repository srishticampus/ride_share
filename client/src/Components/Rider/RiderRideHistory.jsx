import React, { useEffect, useState } from 'react';
import RiderNav from './RiderNav';
import { Button, Divider, IconButton, Typography, Box, Tabs, Tab, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { FaTimes, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import '../Style/RiderRideHistory.css';
import { Link } from 'react-router-dom';
import apiService from '../../Services/apiService';

function RiderRideHistory() {
  const riderId = localStorage.getItem('riderId');
  const riderName = localStorage.getItem('riderName');
  const [allRides, setAllRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await apiService.getAllRides();
        console.log(response);
        
        if (response.status === 'success') {
          setAllRides(response.data.rides);
          
          const pending = response.data.rides.filter(ride => 
            ride.riderId && ride.riderId.some(rider => rider._id === riderId)
          );
          setPendingRides(pending);
          
          const accepted = response.data.rides.filter(ride => 
            ride.acceptedRiderId && ride.acceptedRiderId.some(rider => rider._id === riderId)
          );
          setAcceptedRides(accepted);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRides();
  }, []);

  useEffect(() => {
    if (selectedRide) {
      setLocalMessages(selectedRide.messages || []);
    }
  }, [selectedRide]);

  const handleViewMore = (ride) => {
    setSelectedRide(ride);
  };

  const handleOpenChat = () => {
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setError(null);
  };

  const handleSendMessage = async () => {
    setError(null);
    try {
      if (!message.trim()) {
        setError('Message cannot be empty');
        return;
      }

      if (!selectedRide?._id) {
        setError('No ride selected');
        return;
      }

      // Create a temporary message object for immediate display
      const tempMessage = {
        text: message,
        sender: {
          _id: riderId,
          fullName: riderName || 'You'
        },
        senderType: 'User',
        createdAt: new Date().toISOString()
      };

      // Immediately add the message to local state
      setLocalMessages(prev => [...prev, tempMessage]);

      // Clear the input field
      setMessage('');

      const isDriver = false; // Since this is the rider component
      const response = await apiService.updateRideMessage(
        selectedRide._id,
        message.trim(),
        riderId,
        isDriver
      );

      if (response.status === 'success') {
        // Update all rides state
        setAllRides(prevRides =>
          prevRides.map(ride =>
            ride._id === selectedRide._id
              ? {
                ...ride,
                messages: [...(ride.messages || []), tempMessage]
              }
              : ride
          )
        );
        
        // Update pending/accepted rides
        setPendingRides(prev => prev.map(r => r._id === selectedRide._id ? {...r, messages: [...(r.messages || []), tempMessage]} : r));
        setAcceptedRides(prev => prev.map(r => r._id === selectedRide._id ? {...r, messages: [...(r.messages || []), tempMessage]} : r));
        
        // Update selected ride
        setSelectedRide(prev => ({
          ...prev,
          messages: [...(prev.messages || []), tempMessage]
        }));
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      
      // Remove the temporary message if the send failed
      setLocalMessages(prev => prev.slice(0, -1));
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `${formattedDate}, ${timeString}`;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedRide(null);
  };

  const getSenderName = (message) => {
    if (message.senderType === 'Driver') {
      return selectedRide?.VehicleId?.driverId?.fullname || 'Driver';
    }
    
    // For User messages
    if (message.sender?._id === riderId) {
      return 'You';
    }
    
    // For other riders
    return message.sender?.fullName || 'Rider';
  };

  const renderRideList = (rides) => {
    return rides.length > 0 ? (
      rides.map((ride) => (
        <div 
          key={ride._id} 
          className={`ride-card ${selectedRide?._id === ride._id ? 'selected' : ''}`}
          onClick={() => handleViewMore(ride)}
        >
          <div className="ride-icon">
            <HistoryIcon />
          </div>
          <div className="ride-info">
            <h4>Ride ID: {ride._id.slice(-6).toUpperCase()}</h4>
            <p>Pick Up: {ride.origin}</p>
            <p>Price: ₹{ride.price}</p>
            <p>Date: {formatDate(ride.rideDate)}</p>
          </div>
        </div>
      ))
    ) : (
      <Typography variant="body1" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
        No rides found
      </Typography>
    );
  };

  return (
    <div className="rider-ride-history-container">
      <RiderNav />
      <div className="ride-history-content">
        <div className="ride-history-header">
          <h2>RIDE HISTORY</h2>
          <div className="header-actions">
            <h4>Your Ride History</h4>
            <Link to='/User-review-ride'>
              <Button 
                variant="contained" 
                style={{ backgroundColor: '#F1B92E', color: 'black' }}
              >
                VIEW REVIEWS
              </Button>
            </Link>
          </div>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Pending Requests" />
            <Tab label="Accepted Rides" />
          </Tabs>
        </Box>

        <div className="ride-history-main split-view">
          <div className="ride-list-container">
            <div className="ride-list">
              {tabValue === 0 && renderRideList(pendingRides)}
              {tabValue === 1 && renderRideList(acceptedRides)}
            </div>
          </div>

          <div className="ride-details-container">
            {selectedRide ? (
              <div className="ride-details">
                <div className="details-header">
                  <h3>RIDE DETAILS</h3>
                  <Button 
                    variant="contained" 
                    style={{ backgroundColor: '#F1B92E', color: 'black' }}
                    onClick={handleOpenChat}
                  >
                    Chat
                  </Button>
                </div>

                <div className="payment-section">
                  <h4 className="section-header">Payment</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Ride ID:</strong> {selectedRide._id.slice(-6).toUpperCase()}</p>
                      <p><strong>Rider ID:</strong> {riderId.slice(-6).toUpperCase()}</p>
                      <p><strong>Payment Amount:</strong> ₹{selectedRide.price}</p>
                      <p><strong>Payment Status:</strong> {selectedRide.paymentStatus || 'Pending'}</p>
                    </div>
                    <div className="details-right">
                      <p><strong>Driver ID:</strong> {selectedRide.VehicleId?.driverId?._id.slice(-6).toUpperCase() || 'N/A'}</p>
                      <p><strong>Driver Name:</strong> {selectedRide.VehicleId?.driverId?.fullname || 'N/A'}</p>
                      <p><strong>Payment Method:</strong> {selectedRide.paymentMethod || 'N/A'}</p>
                      <p><strong>Transaction Date:</strong> {formatDate(selectedRide.rideDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="route-section">
                  <h4 className="section-header">Route</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Pick Up Location:</strong> {selectedRide.origin}</p>
                      <p><strong>Pick Up Date & Time:</strong> {formatDateTime(selectedRide.rideDate, selectedRide.rideTime)}</p>
                    </div>
                    <div className="details-right">
                      <p><strong>Drop-Off Location:</strong> {selectedRide.destination}</p>
                      <p><strong>Estimated Drop-Off Time:</strong> {selectedRide.estimatedDropOffTime || 'N/A'}</p>
                    </div>
                  </div>
                  <p><strong>Route:</strong> {selectedRide.route || 'N/A'}</p>
                  <p><strong>Special Note:</strong> {selectedRide.specialNote || 'None'}</p>
                </div>

                <div className="vehicle-section">
                  <h4 className="section-header">Vehicle Details</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Vehicle Make:</strong> {selectedRide.VehicleId?.vehicleMake || 'N/A'}</p>
                      <p><strong>Vehicle Model:</strong> {selectedRide.VehicleId?.vehicleModel || 'N/A'}</p>
                    </div>
                    <div className="details-right">
                      <p><strong>Vehicle Color:</strong> {selectedRide.VehicleId?.vehicleColor || 'N/A'}</p>
                      <p><strong>License Plate:</strong> {selectedRide.VehicleId?.licensePlate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
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
          CHAT WITH DRIVER
          <IconButton onClick={handleCloseChat} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Driver: {selectedRide?.VehicleId?.driverId?.fullname || ''}</Typography>
          </Box>

          {/* Message History */}
          <Box sx={{
            height: 300,
            overflow: 'auto',
            mb: 2,
            p: 1,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {localMessages.map((msg, index) => {
              const isCurrentUser = msg.senderType === 'User' && msg.sender?._id === riderId;
              const isDriver = msg.senderType === 'Driver';
              const senderName = getSenderName(msg);

              return (
                <Box key={index} sx={{
                  mb: 1,
                  p: 1,
                  maxWidth: '80%',
                  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                  bgcolor: isCurrentUser ? '#e3f2fd' : isDriver ? '#ffebee' : '#f1f1f1',
                  borderRadius: 2,
                  borderBottomRightRadius: isCurrentUser ? 0 : 2,
                  borderBottomLeftRadius: isCurrentUser ? 2 : 0
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isDriver ? '#d32f2f' : 'inherit'}}>
                    {senderName}
                  </Typography>
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* New Message Input */}
          <TextField
            label="Your Message"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            sx={{
              backgroundColor: '#f59e0b',
              color: 'black',
              '&:hover': { backgroundColor: '#e69100' },
              width: '100%',
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RiderRideHistory;