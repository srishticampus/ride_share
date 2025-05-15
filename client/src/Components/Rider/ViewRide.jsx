import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaStar, FaTimes } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import '../Style/ViewRide.css';
import image from '../../Assets/car4.png';
import RiderNav from './RiderNav';
import RiderSearch from './RiderSearch';
import { Box } from '@mui/material';
import apiService from '../../Services/apiService';

const ViewRide = () => {
  const riderId = localStorage.getItem('riderId');
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await apiService.getAllRides();
        if (response.status === 'success') {
          setRides(response.data.rides);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRides();
  }, []);

  const handleViewDetails = (ride) => setSelectedRide(ride);
  const handleCloseModal = () => setSelectedRide(null);
  const handleJoinRide = () => setShowChatModal(true);
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

      const response = await apiService.updateRideMessage(
        selectedRide._id,
        message.trim()
      );

      if (response.status === 'success') {
        setRides(prevRides =>
          prevRides.map(ride =>
            ride._id === selectedRide._id
              ? {
                ...ride,
                messages: [
                  ...(ride.messages || []),
                  {
                    text: message,
                    sender: riderId,
                    createdAt: new Date().toISOString()
                  }
                ]
              }
              : ride
          )
        );
        setMessage('');
        setShowChatModal(false);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
    }
  };
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="view-ride-container">
      <RiderNav />

      <main className="view-ride-main">
        <h1 className="view-ride-title">RIDE</h1>
        <div className="view-ride-header">
          <div className="view-ride-subtitle">VIEW RIDES</div>
          <RiderSearch />
        </div>

        <section className="view-ride-grid">
          {rides.map((ride) => (
            <article key={ride._id} className="view-ride-card">
              <img alt="Taxi car" className="view-ride-image" src={image} />
              <div className="view-ride-details">
                <div className="view-ride-time">
                  <span>{ride.rideTime}</span>
                  <span>{formatDate(ride.rideDate)}</span>
                </div>
                <p className="view-ride-pickup">Pick Up at {ride.origin}</p>
                <p className="view-ride-dropoff">
                  <FaMapMarkerAlt className="view-ride-marker" />
                  Drop Off: {ride.destination}
                </p>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f59e0b',
                    color: 'black',
                    fontSize: '10px',
                    borderRadius: '2px',
                    padding: '4px 16px',
                    minWidth: 'auto',
                    '&:hover': { backgroundColor: '#e69100' },
                  }}
                  onClick={() => handleViewDetails(ride)}
                >
                  View Details
                </Button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Ride Details Dialog */}
      <Dialog open={!!selectedRide} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle style={{ color: "#F1B92E" }}>
          RIDE DETAILS
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRide && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Driver:</Typography>
                <Typography variant="body1" sx={{ textAlign: 'right' }}>{selectedRide.VehicleId.driverId.fullname}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Vehicle:</Typography>
                <Typography variant="body1">{selectedRide.VehicleId.vehicleMake} {selectedRide.VehicleId.vehicleModel}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Vehicle Color:</Typography>
                <Typography variant="body1">{selectedRide.VehicleId.vehicleColor}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Vehicle Type:</Typography>
                <Typography variant="body1">{selectedRide.VehicleId.vehicleType}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Available Seats:</Typography>
                <Typography variant="body1">{selectedRide.availableSeats}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Price:</Typography>
                <Typography variant="body1">₹{selectedRide.price}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Status:</Typography>
                <Typography variant="body1">{selectedRide.status}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Contact:</Typography>
                <Typography variant="body1">{selectedRide.VehicleId.driverId.phoneNumber}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Route:</Typography>
                <Typography variant="body1">{selectedRide.route}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Special Note:</Typography>
                <Typography variant="body1">{selectedRide.specialNote}</Typography>
              </Box>
            </Box>
          )}

          <Box sx={{
            mt: 3,
            p: 2,
            backgroundColor: '#fff9e6',
            borderRadius: 1,
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              NOTE: {selectedRide?.rideDescription || 'Please be at the pickup location 5 minutes before the pickup time.'}
            </Typography>
          </Box>        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleJoinRide}
            variant="contained"
            sx={{
              backgroundColor: '#f59e0b',
              color: 'black',
              '&:hover': { backgroundColor: '#e69100' },
              width: '100%',
            }}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatModal} onClose={handleCloseChat} fullWidth maxWidth="sm">
        <DialogTitle style={{ color: "#F1B92E" }}>
          CHAT WITH DRIVER
          <IconButton onClick={handleCloseChat} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Driver"
            fullWidth
            margin="normal"
            value={selectedRide?.VehicleId?.driverId?.fullname || ''}
            InputProps={{ readOnly: true }}
          />

          {/* Message History */}
          <Box sx={{
            maxHeight: 200,
            overflow: 'auto',
            mb: 2,
            p: 1,
            bgcolor: '#f5f5f5',
            borderRadius: 1
          }}>
            {selectedRide?.messages?.map((msg, index) => (
              <Box key={index} sx={{
                mb: 1,
                p: 1,
                bgcolor: msg.sender === 'currentUser' ? '#e3f2fd' : '#f1f1f1',
                borderRadius: 1,
                alignSelf: msg.sender === 'currentUser' ? 'flex-end' : 'flex-start'
              }}>
                <Typography variant="body2">
                  <strong>{msg.sender === 'currentUser' ? 'You' : 'Driver'}:</strong> {msg.text}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
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
};

export default ViewRide;