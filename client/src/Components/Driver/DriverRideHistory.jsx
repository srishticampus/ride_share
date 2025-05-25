import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button, Divider, IconButton, Typography, Box, Tabs, Tab, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { FaTimes, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import '../Style/RiderRideHistory.css';
import DriverNav from '../Driver/DriverNav';
import apiService from '../../Services/apiService';
import { toast } from 'react-toastify';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';
import { ClickAwayListener } from '@mui/material';

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
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentDriver, setCurrentDriver] = useState({});
  
  const driverId = localStorage.getItem('driverId');
  const driverName = localStorage.getItem('driverName');

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const driverData = await apiService.getCurrentDriver();
        setCurrentDriver(driverData.data.driver);
        localStorage.setItem("driverData", JSON.stringify(driverData.data.driver));
      } catch (error) {
        console.error("Failed to load driver data:", error);
      }
    };

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
      fetchDriverData();
      fetchRides();
    }
  }, [driverId]);

  useEffect(() => {
    if (selectedRide) {
      setLocalMessages(selectedRide.messages || []);
    }
  }, [selectedRide]);

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

      const tempMessage = {
        text: message,
        sender: {
          _id: driverId,
          fullname: driverName || 'You'
        },
        senderType: 'Driver',
        createdAt: new Date().toISOString()
      };

      setLocalMessages(prev => [...prev, tempMessage]);

      setMessage('');

      const isDriver = true; 
      const response = await apiService.updateRideMessage(
        selectedRide._id,
        message.trim(),
        driverId,
        isDriver
      );

      if (response.status === 'success') {
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

        setAcceptedRides(prev => prev.map(r => r._id === selectedRide._id ? { ...r, messages: [...(r.messages || []), tempMessage] } : r));
        setCompletedRides(prev => prev.map(r => r._id === selectedRide._id ? { ...r, messages: [...(r.messages || []), tempMessage] } : r));

        setSelectedRide(prev => ({
          ...prev,
          messages: [...(prev.messages || []), tempMessage]
        }));
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');

      setLocalMessages(prev => prev.slice(0, -1));
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      setLoading(true);

      setAcceptedRides(prev =>
        prev.map(ride =>
          ride._id === rideId
            ? { ...ride, status: 'accepted' }
            : ride
        )
      );

      const response = await apiService.acceptRide(rideId, driverId);

      if (response.status === 'success') {
        const updatedRide = response.data.ride;
        setAcceptedRides(prev =>
          prev.map(ride =>
            ride._id === rideId
              ? updatedRide
              : ride
          )
        );
      }
      toast.success("Accepted Successfully")

    } catch (err) {
      console.error('Error accepting ride:', err);
      setAcceptedRides(prev =>
        prev.map(ride =>
          ride._id === rideId
            ? { ...ride, status: 'pending' }
            : ride
        )
      );
    } finally {
      setLoading(false);
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
      return 'You';
    }

    if (message.sender?._id) {
      const rider = selectedRide?.acceptedRiderId?.find(r => r._id === message.sender._id);
      return rider?.fullName || 'Passenger';
    }

    return 'Unknown';
  };

  const renderRideList = (rides) => {
    if (loading) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
          Loading rides...
        </Typography>
      );
    }

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
          <div className="ride-info" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            gap: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <h4>Ride ID: {ride._id.slice(-6).toUpperCase()}</h4>
              <p>From: {ride.origin}</p>
              <p>To: {ride.destination}</p>
              <p>Fare: ₹{ride.price}</p>
              <p>Date: {formatDate(ride.rideDate)}</p>
            </div>
            {tabValue === 0 && ride.status === 'pending' && (
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptRide(ride._id);
                }}
                sx={{
                  backgroundColor: '#4CAF50',
                  minWidth: '120px',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                  }
                }}
              >
                Accept Ride
              </Button>
            )}
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
      <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />
      <div className="ride-history-content">
        <div className="ride-history-header">
          <h2>RIDE HISTORY</h2>
          <div className="header-actions">
            <h4>Your Ride History</h4>
          </div>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Accepted Requests" />
            <Tab label="Completed Rides" />
          </Tabs>
        </Box>

        <div className="ride-history-main split-view">
          <div className="ride-list-container">
            <div className="ride-list">
              {tabValue === 0 && renderRideList(acceptedRides)}
              {tabValue === 1 && renderRideList(completedRides)}
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
                  <h4 className="section-header">RIDE INFO</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Ride ID:</strong> {selectedRide._id.slice(-6).toUpperCase()}</p>
                      <p><strong>Driver ID:</strong> {driverId.slice(-6).toUpperCase()}</p>
                      <p><strong>Fare:</strong> ₹{selectedRide.price}</p>
                    </div>
                    <div className="details-right">
                      <p><strong>Vehicle:</strong> {selectedRide.VehicleId?.vehicleMake || 'N/A'} {selectedRide.VehicleId?.vehicleModel || ''}</p>
                      <p><strong>Vehicle Number:</strong> {selectedRide.VehicleId?.vehicleRegistrationNo || 'N/A'}</p>
                      <p><strong>Seats :</strong> {selectedRide.availableSeats || 'N/A'}</p>
                      <p><strong>Date:</strong> {formatDate(selectedRide.rideDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="route-section">
                  <h4 className="section-header">Route</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Pick Up:</strong> {selectedRide.origin}</p>
                      <p><strong>Date & Time:</strong> {formatDateTime(selectedRide.rideDate, selectedRide.rideTime)}</p>
                      <p><strong>Route:</strong> {selectedRide.route || 'N/A'}</p>
                    </div>
                    <div className="details-right">
                      <p><strong>Destination:</strong> {selectedRide.destination}</p>
                      <p><strong>Special Note:</strong> {selectedRide.specialNote || 'None'}</p>
                    </div>
                  </div>
                </div>

                <div className="passenger-section">
                  <h4 className="section-header">Passenger Info</h4>
                  <Divider />
                  {selectedRide.acceptedRiderId?.length > 0 ? (
                    selectedRide.acceptedRiderId.map((rider, index) => (
                      <div key={index} className="details-grid">
                        <div className="details-left">
                          <p><strong>Name:</strong> {rider.fullName || 'N/A'}</p>
                          <p><strong>Phone:</strong> {rider.phoneNumber || 'N/A'}</p>
                        </div>
                        <div className="details-right">
                          <p><strong>Email:</strong> {rider.email || 'N/A'}</p>
                          <p><strong>Emergency Contact:</strong> {rider.emergencyNo || 'N/A'}</p>
                        </div>
                        {selectedRide.acceptedRiderId.length > 1 && index < selectedRide.acceptedRiderId.length - 1 && (
                          <Divider sx={{ my: 1, width: '100%' }} />
                        )}
                      </div>
                    ))
                  ) : selectedRide.riderId?.length > 0 ? (
                    selectedRide.riderId.map((rider, index) => (
                      <div key={index} className="details-grid">
                        <div className="details-left">
                          <p><strong>Name:</strong> {rider.fullName || 'N/A'}</p>
                          <p><strong>Phone:</strong> {rider.phoneNumber || 'N/A'}</p>
                        </div>
                        <div className="details-right">
                          <p><strong>Email:</strong> {rider.email || 'N/A'}</p>
                          <p><strong>Emergency Contact:</strong> {rider.emergencyNo || 'N/A'}</p>
                        </div>
                        {selectedRide.riderId.length > 1 && index < selectedRide.riderId.length - 1 && (
                          <Divider sx={{ my: 1, width: '100%' }} />
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No passenger information available</p>
                  )}
                </div>

                <div className="payment-info-section">
                  <h4 className="section-header">Payment Information</h4>
                  <Divider />
                  {selectedRide.successfulPayments?.length > 0 ? (
                    <div className="payment-details">
                      {selectedRide.successfulPayments.map((payment, index) => {
                        const rider = selectedRide.acceptedRiderId?.find(
                          r => r._id === payment.riderId._id
                        );

                        return (
                          <div key={index} className="details-grid">
                            <div className="details-left">
                              <p><strong>Rider:</strong> {rider?.fullName || 'Unknown Rider'}</p>
                              <p><strong>Amount:</strong> ₹{payment.amount}</p>
                            </div>
                            <div className="details-right">
                              <p><strong>Payment Time:</strong>
                                {new Date(payment.paymentTime).toLocaleString()}
                              </p>
                              <p><strong>Status:</strong> Paid</p>
                            </div>
                            {index < selectedRide.successfulPayments.length - 1 && (
                              <Divider sx={{ my: 1, width: '100%' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No payment information available</p>
                  )}
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

      <Dialog open={showChatModal} onClose={handleCloseChat} fullWidth maxWidth="sm">
        <DialogTitle style={{ color: "#F1B92E" }}>
          CHAT WITH PASSENGER
          <IconButton onClick={handleCloseChat} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Ride: {selectedRide?.origin} to {selectedRide?.destination}
            </Typography>
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
              const isCurrentUser = msg.senderType === 'Driver' && msg.sender?._id === driverId;
              const isPassenger = msg.senderType === 'User';
              const senderName = getSenderName(msg);

              return (
                <Box key={index} sx={{
                  mb: 1,
                  p: 1,
                  maxWidth: '80%',
                  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                  bgcolor: isCurrentUser ? '#e3f2fd' : isPassenger ? '#ffebee' : '#f1f1f1',
                  borderRadius: 2,
                  borderBottomRightRadius: isCurrentUser ? 0 : 2,
                  borderBottomLeftRadius: isCurrentUser ? 2 : 0
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isPassenger ? '#d32f2f' : 'inherit' }}>
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

          <TextField
            label="Your Message"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={tabValue === 1 ? "Chat is closed for completed rides" : "Type your message here..."}
            disabled={tabValue === 1}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && tabValue !== 1) {
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
          {tabValue === 1 ? (
            <Button
              onClick={handleCloseChat}
              variant="contained"
              sx={{
                backgroundColor: '#f59e0b',
                color: 'black',
                '&:hover': { backgroundColor: '#e69100' },
                width: '100%',
              }}
            >
              Close Chat
            </Button>
          ) : (
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
          )}
        </DialogActions>
      </Dialog>

      {showProfileCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{ position: "absolute", top: "40px", right: "20px" }}>
            <DriverViewProfile onEditClick={onEditClick} driver={currentDriver} />
          </div>
        </ClickAwayListener>
      )}

      {showProfileEditCard && currentDriver && (
        <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
          <div style={{ 
            position: "fixed", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            backgroundColor: "white", 
            zIndex: "5", 
            borderRadius: "25px",
            boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
            maxHeight: "90vh",
            overflowY: "auto"
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
    </div>
  );
}

export default DriverRideHistory;