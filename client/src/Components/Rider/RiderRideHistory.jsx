import React, { useEffect, useState } from 'react';
import RiderNav from './RiderNav';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Rating,
  TextareaAutosize
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import '../Style/RiderRideHistory.css';
import { Link } from 'react-router-dom';
import apiService from '../../Services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import { ClickAwayListener } from '@mui/material';
import RiderViewProfile from './RiderViewProfile';
import RiderEditProfile from './RiderEditProfile';

function RiderRideHistory() {
  const riderId = localStorage.getItem('riderId');
  const riderName = localStorage.getItem('riderName');
  const [allRides, setAllRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMode, setPaymentMode] = useState('OnlinePayment');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState({
    comment: '',
    rating: 0
  });
  const [reviewedRides, setReviewedRides] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('reviewedRides');
    return saved ? JSON.parse(saved) : {};
  });

  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        localStorage.setItem("UserInfo", JSON.stringify(userData.data.user));
        setCurrentUser(userData.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Save reviewed rides to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('reviewedRides', JSON.stringify(reviewedRides));
  }, [reviewedRides]);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllRides();
      if (response.status === 'success') {
        setAllRides(response.data.rides || []);

        const pending = (response.data.rides || []).filter(ride =>
          ride.riderId && ride.riderId.some(rider => rider._id === riderId)
        );
        setPendingRides(pending);

        const accepted = (response.data.rides || []).filter(ride =>
          ride.acceptedRiderId && ride.acceptedRiderId.some(rider => rider._id === riderId)
        );
        setAcceptedRides(accepted);
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await apiService.getRatingsByRider(riderId);
      if (response.status === 'success') {
        const ratingsMap = {};
        response.data.ratings.forEach(rating => {
          ratingsMap[rating.rideId] = true;
        });
        // Update both reviewedRides state and localStorage
        setReviewedRides(prev => ({ ...prev, ...ratingsMap }));
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  useEffect(() => {
    fetchRides();
    fetchRatings();
  }, [riderId]);

  useEffect(() => {
    if (selectedRide) {
      setLocalMessages(selectedRide.messages || []);
    }
  }, [selectedRide]);

  const hasPaid = (ride) => {
    if (!ride || !ride.successfulPayments) return false;
    return ride.successfulPayments.some(payment =>
      (payment.riderId && (payment.riderId._id === riderId || payment.riderId === riderId))
    )
  };

  const hasReviewed = (rideId) => {
    return reviewedRides[rideId] || false;
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
    setMessage('');
  };

  const handleOpenPayment = (ride) => {
    setSelectedRide(ride);
    setShowPaymentModal(true);
  };

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setPaymentMode('OnlinePayment');
    setPaymentProcessing(false);
    setError(null);
  };

  const handleOpenRating = () => {
    setShowRatingModal(true);
  };

  const handleCloseRating = () => {
    setShowRatingModal(false);
    setReview({
      comment: '',
      rating: 0
    });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setReview(prev => ({
      ...prev,
      rating: newValue
    }));
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
          _id: riderId,
          fullName: riderName || 'You'
        },
        senderType: 'User',
        createdAt: new Date().toISOString()
      };

      setLocalMessages(prev => [...prev, tempMessage]);
      setMessage('');

      const response = await apiService.updateRideMessage(
        selectedRide._id,
        message.trim(),
        riderId,
        false
      );

      if (response.status === 'success') {
        const updatedRide = response.data.ride;
        setAllRides(prev => prev.map(r => r._id === updatedRide._id ? updatedRide : r));
        setPendingRides(prev => prev.map(r => r._id === updatedRide._id ? updatedRide : r));
        setAcceptedRides(prev => prev.map(r => r._id === updatedRide._id ? updatedRide : r));

        if (selectedRide._id === updatedRide._id) {
          setSelectedRide(updatedRide);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      setLocalMessages(prev => prev.slice(0, -1));
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      setPaymentProcessing(true);
      setError(null);

      const optimisticPayment = {
        riderId: riderId,
        paymentMode: paymentMode,
        paymentStatus: 'success',
        paymentTime: new Date().toISOString(),
        PaymentMode: paymentMode // Make sure this matches your backend expectation
      };

      const updatedRide = {
        ...selectedRide,
        successfulPayments: [
          ...(selectedRide.successfulPayments || []),
          optimisticPayment
        ]
      };

      setSelectedRide(updatedRide);
      setAcceptedRides(prev => prev.map(r => r._id === updatedRide._id ? updatedRide : r));
      setAllRides(prev => prev.map(r => r._id === updatedRide._id ? updatedRide : r));

      handleClosePayment();

      const response = await apiService.processPayment(selectedRide._id, {
        riderId: riderId,
        paymentMode: paymentMode, // This should be passed correctly
        paymentStatus: 'success',
        PaymentMode: paymentMode // Some backends might expect this capitalization
      });

      toast.success("Payment sent successfully");

      if (response.status === 'success' || (response.status >= 200 && response.status < 300)) {
        await fetchRides();
        if (selectedRide._id === response.data?.ride?._id) {
          setSelectedRide(response.data.ride);
        }
      } else {
        throw new Error(response.message || 'Payment processing failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      if (!err.message.includes('Payment processing failed')) {
        setError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setPaymentProcessing(false);
    }
  };
  const submitReview = async () => {
    try {
      if (!selectedRide) return;

      const reviewData = {
        rideId: selectedRide._id,
        driverId: selectedRide.VehicleId?.driverId?._id,
        reviewerId: riderId,
        rating: review.rating,
        reviewText: review.comment,
        reviewType: 'riderToDriver'
      };

      const response = await apiService.createRating(reviewData);

      if (response.status === 'success') {
        toast.success("Review submitted successfully");
        // Update both state and localStorage
        setReviewedRides(prev => ({
          ...prev,
          [selectedRide._id]: true
        }));
        handleCloseRating();
      } else {
        throw new Error(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return 'N/A';
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
    if (!message) return 'Unknown';
    if (message.senderType === 'Driver') {
      return selectedRide?.VehicleId?.driverId?.fullname || 'Driver';
    }
    if (message.sender?._id === riderId) {
      return 'You';
    }
    return message.sender?.fullName || 'Rider';
  };

  const renderRideList = (rides) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!rides || rides.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
          No rides found
        </Typography>
      );
    }

    return rides.map((ride) => {
      const isJoined = ride.acceptedRiderId?.some(rider => rider._id === riderId) ||
        ride.riderId?.some(rider => rider._id === riderId);

      return (
        <div
          key={ride._id}
          className={`ride-card ${selectedRide?._id === ride._id ? 'selected' : ''}`}
          onClick={() => handleViewMore(ride)}
        >
          <div className="ride-icon">
            <HistoryIcon />
          </div>
          <div className="ride-info">
            <h4>Ride ID: {ride._id?.slice(-6).toUpperCase() || 'N/A'}</h4>
            <p>Pick Up: {ride.origin || 'N/A'}</p>
            <p>Price: ₹{ride.price || '0'}</p>
            <p>Date: {formatDate(ride.rideDate)}</p>
            {tabValue === 1 && !hasPaid(ride) && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPayment(ride);
                }}
                sx={{ mt: 1 }}
              >
                Pay
              </Button>
            )}
            {tabValue === 1 && hasPaid(ride) && (
              <Typography variant="caption" color="success" sx={{ mt: 1, display: 'block' }}>
                Paid
              </Typography>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="rider-ride-history-container">
      <RiderNav onAvatarClick={onAvatarClick} />
      <ToastContainer />
      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <div style={{
            position: "absolute",
            top: "40px",
            right: "20px",
            zIndex: 1000
          }}>
            <RiderViewProfile
              onEditClick={onEditClick}
              currentUser={currentUser}
            />
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
            zIndex: 1000,
            borderRadius: "25px",
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <RiderEditProfile
              setShowProfileEditCard={setShowProfileEditCard}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>
        </ClickAwayListener>
      )}

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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {hasPaid(selectedRide) && !hasReviewed(selectedRide._id) && (
                      <Button
                        variant="contained"
                        style={{ backgroundColor: '#F1B92E', color: 'black' }}
                        onClick={handleOpenRating}
                      >
                        Review
                      </Button>
                    )}
                    {!hasPaid(selectedRide) && (
                      <Button
                        variant="contained"
                        style={{ backgroundColor: '#F1B92E', color: 'black' }}
                        onClick={handleOpenChat}
                        disabled={!selectedRide.VehicleId?.driverId}
                      >
                        Chat
                      </Button>
                    )}
                  </div>
                </div>

                <div className="payment-section">
                  <h4 className="section-header">Payment</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Ride ID:</strong> {selectedRide._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                      <p><strong>Rider ID:</strong> {riderId?.slice(-6).toUpperCase() || 'N/A'}</p>
                      <p><strong>Payment Amount:</strong> ₹{selectedRide.price || '0'}</p>
                      <p><strong>Payment Status:</strong>
                        {hasPaid(selectedRide) ? (
                          <span style={{ color: 'green' }}>Completed</span>
                        ) : (
                          <span style={{ color: 'orange' }}>Pending</span>
                        )}
                      </p>
                    </div>
                    <div className="details-right">
                      <p><strong>Driver ID:</strong> {selectedRide.VehicleId?.driverId?._id || 'N/A'}</p>
                      <p><strong>Driver Name:</strong> {selectedRide.VehicleId?.driverId?.fullname || 'N/A'}</p>
                      <p><strong>Payment Method:</strong>
                        {hasPaid(selectedRide)
                          ? (selectedRide.successfulPayments?.find(p =>
                            (p.riderId?._id === riderId || p.riderId === riderId)
                          )?.PaymentMode ||
                            selectedRide.successfulPayments?.find(p =>
                              (p.riderId?._id === riderId || p.riderId === riderId)
                            )?.paymentMode ||
                            'N/A')
                          : 'N/A'}
                      </p>
                      <p><strong>Transaction Date:</strong>
                        {hasPaid(selectedRide)
                          ? formatDate(selectedRide.successfulPayments?.find(p =>
                            (p.riderId?._id === riderId || p.riderId === riderId)
                          )?.paymentTime)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="route-section">
                  <h4 className="section-header">Route</h4>
                  <Divider />
                  <div className="details-grid">
                    <div className="details-left">
                      <p><strong>Pick Up Location:</strong> {selectedRide.origin || 'N/A'}</p>
                      <p><strong>Pick Up Date & Time:</strong> {formatDateTime(selectedRide.rideDate, selectedRide.rideTime)}</p>
                      <p><strong>Special Note:</strong> {selectedRide.specialNote || 'None'}</p>
                    </div>
                    <div className="details-right">
                      <p><strong>Drop-Off Location:</strong> {selectedRide.destination || 'N/A'}</p>
                      <p><strong>Route:</strong> {selectedRide.route || 'N/A'}</p>
                    </div>
                  </div>
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
      {selectedRide && !hasPaid(selectedRide) && (
        <Dialog open={showChatModal} onClose={handleCloseChat} fullWidth maxWidth="sm">
          <DialogTitle style={{ color: "#F1B92E" }}>
            CHAT WITH DRIVER
            <IconButton onClick={handleCloseChat} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <FaTimes />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Driver: {selectedRide?.VehicleId?.driverId?.fullname || 'Not assigned'}</Typography>
            </Box>

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
              {(localMessages || []).map((msg, index) => {
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
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 'bold',
                      color: isDriver ? '#d32f2f' : 'inherit'
                    }}>
                      {senderName}
                    </Typography>
                    <Typography variant="body1">{msg.text || ''}</Typography>
                    <Typography variant="caption" sx={{
                      color: 'text.secondary',
                      display: 'block',
                      textAlign: 'right'
                    }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
              placeholder="Type your message here..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!selectedRide?.VehicleId?.driverId}
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
              disabled={!selectedRide?.VehicleId?.driverId}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Payment Dialog */}
      {selectedRide && (
        <Dialog
          open={showPaymentModal}
          onClose={handleClosePayment}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            style={{
              color: "#F1B92E",
              padding: '16px 24px',
              fontSize: '1.25rem',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            MAKE PAYMENT
            <IconButton
              onClick={handleClosePayment}
              sx={{
                color: '#F1B92E',
                '&:hover': {
                  backgroundColor: 'rgba(241, 185, 46, 0.1)'
                }
              }}
            >
              <FaTimes />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers style={{ padding: '24px', backgroundColor: '#f8f9fa' }}>
            <Box sx={{
              mb: 3,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="h6" gutterBottom style={{ color: '#F1B92E', fontWeight: '600' }}>
                Ride Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Typography style={{ color: '#555' }}>From:</Typography>
                <Typography style={{ fontWeight: '500' }}>{selectedRide.origin || 'N/A'}</Typography>

                <Typography style={{ color: '#555' }}>To:</Typography>
                <Typography style={{ fontWeight: '500' }}>{selectedRide.destination || 'N/A'}</Typography>

                <Typography style={{ color: '#555' }}>Date:</Typography>
                <Typography style={{ fontWeight: '500' }}>{formatDate(selectedRide.rideDate)}</Typography>

                <Typography style={{ color: '#555' }}>Time:</Typography>
                <Typography style={{ fontWeight: '500' }}>{selectedRide.rideTime || 'N/A'}</Typography>
              </Box>
            </Box>

            <Box sx={{
              mb: 3,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="h6" gutterBottom style={{ color: '#F1B92E', fontWeight: '600' }}>
                Payment Information
              </Typography>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 1,
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <Typography style={{ color: '#555' }}>Amount:</Typography>
                <Typography style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#2c3e50'
                }}>
                  ₹{selectedRide.price || '0'}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel
                  id="payment-mode-label"
                  style={{ color: '#555' }}
                >
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment-mode-label"
                  value={paymentMode}
                  label="Payment Method"
                  onChange={(e) => setPaymentMode(e.target.value)}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                >
                  <MenuItem value="OnlinePayment" style={{ color: '#2c3e50' }}>Online Payment</MenuItem>
                  <MenuItem value="Cash" style={{ color: '#2c3e50' }}>Cash</MenuItem>
                </Select>
              </FormControl>

              {paymentMode === 'OnlinePayment' && (
                <Box sx={{
                  mt: 2,
                  p: 2,
                  border: '1px dashed #F1B92E',
                  backgroundColor: 'rgba(241, 185, 46, 0.05)',
                  borderRadius: '8px'
                }}>
                  <Typography variant="body2" style={{ color: '#555', textAlign: 'center' }}>
                    You will be redirected to our secure payment gateway to complete the transaction.
                  </Typography>
                </Box>
              )}

              {paymentMode === 'Cash' && (
                <Box sx={{
                  mt: 2,
                  p: 2,
                  border: '1px dashed #2c3e50',
                  backgroundColor: 'rgba(44, 62, 80, 0.05)',
                  borderRadius: '8px'
                }}>
                  <Typography variant="body2" style={{ color: '#555', textAlign: 'center' }}>
                    Please pay the driver in cash when you board the vehicle.
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: '8px',
                  borderLeft: '4px solid #d32f2f'
                }}
              >
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions style={{
            padding: '16px 24px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #eee'
          }}>
            <Button
              onClick={handleClosePayment}
              style={{
                color: '#2c3e50',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                textTransform: 'none'
              }}
              disabled={paymentProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              variant="contained"
              disabled={paymentProcessing}
              style={{
                backgroundColor: '#F1B92E',
                color: '#2c3e50',
                fontWeight: '600',
                padding: '8px 24px',
                borderRadius: '6px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#e69100',
                  boxShadow: 'none'
                }
              }}
              startIcon={paymentProcessing ? <CircularProgress size={20} style={{ color: '#2c3e50' }} /> : null}
            >
              {paymentProcessing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Rating Dialog */}
      {selectedRide && (
        <Dialog
          open={showRatingModal}
          onClose={handleCloseRating}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            style={{
              color: "#F1B92E",
              padding: '16px 24px',
              fontSize: '1.25rem',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            RIDE REVIEW
            <IconButton
              onClick={handleCloseRating}
              sx={{
                color: '#F1B92E',
                '&:hover': {
                  backgroundColor: 'rgba(241, 185, 46, 0.1)'
                }
              }}
            >
              <FaTimes />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers style={{ padding: '24px' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom style={{ color: '#F1B92E', fontWeight: '600' }}>
                How was your ride with {selectedRide.VehicleId?.driverId?.fullname || 'the driver'}?
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom style={{ fontWeight: '500', marginBottom: '8px' }}>
                Share your thoughts (optional)
              </Typography>
              <TextareaAutosize
                name="comment"
                value={review.comment}
                onChange={handleReviewChange}
                minRows={3}
                placeholder="Tell us about your experience..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom style={{ fontWeight: '500', marginBottom: '16px' }}>
                Rate your experience
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  name="rating"
                  value={review.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                  size="large"
                  style={{ color: '#F1B92E' }}
                />
                <Typography variant="body2" style={{ marginLeft: '8px', color: '#555' }}>
                  {review.rating > 0 ? `${review.rating} stars` : 'Not rated'}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions style={{
            padding: '16px 24px',
            borderTop: '1px solid #eee',
            display: "flex",
            justifyContent: "center",
          }}>
            <Button
              onClick={handleCloseRating}
              style={{
                color: '#2c3e50',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                textTransform: 'none'
              }}
            >
              Skip
            </Button>
            <Button
              onClick={submitReview}
              variant="contained"
              style={{
                backgroundColor: '#F1B92E',
                color: '#2c3e50',
                fontWeight: '600',
                padding: '8px 24px',
                borderRadius: '6px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#e69100',
                  boxShadow: 'none'
                }
              }}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default RiderRideHistory;