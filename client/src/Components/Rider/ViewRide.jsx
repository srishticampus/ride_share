import React, { useState } from 'react';
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
const ViewRide = () => {
  const rideData = [
    { id: 1, time: '10:15 AM', date: 'Sun, Apr 15', pickup: '123 Main Street', dropoff: 'Central Park', driver: 'John Doe', rating: 4.5, seats: 4, cost: '$25.00', vehicle: 'Toyota Camry', status: 'Scheduled', contact: '555-1234' },
    { id: 2, time: '11:30 AM', date: 'Mon, Apr 16', pickup: '456 Oak Avenue', dropoff: 'Airport Terminal', driver: 'Jane Smith', rating: 4.8, seats: 3, cost: '$35.50', vehicle: 'Honda Accord', status: 'Completed', contact: '555-5678' },
    { id: 3, time: '02:45 PM', date: 'Tue, Apr 17', pickup: '789 Pine Road', dropoff: 'Shopping Mall', driver: 'Mike Johnson', rating: 4.2, seats: 2, cost: '$18.75', vehicle: 'Ford Fusion', status: 'In Progress', contact: '555-9012' },
    { id: 4, time: '08:20 AM', date: 'Wed, Apr 18', pickup: '321 Elm Street', dropoff: 'University Campus', driver: 'Sarah Williams', rating: 4.9, seats: 3, cost: '$22.00', vehicle: 'Chevy Malibu', status: 'Scheduled', contact: '555-3456' },
    { id: 5, time: '04:10 PM', date: 'Thu, Apr 19', pickup: '654 Maple Drive', dropoff: 'Train Station', driver: 'David Brown', rating: 4.3, seats: 4, cost: '$30.25', vehicle: 'Nissan Altima', status: 'Completed', contact: '555-7890' },
    { id: 6, time: '09:00 AM', date: 'Fri, Apr 20', pickup: '987 Cedar Lane', dropoff: 'Hospital', driver: 'Emily Davis', rating: 4.7, seats: 2, cost: '$15.50', vehicle: 'Hyundai Sonata', status: 'Scheduled', contact: '555-2345' },
    { id: 7, time: '01:30 PM', date: 'Sat, Apr 21', pickup: '135 Birch Boulevard', dropoff: 'Convention Center', driver: 'Robert Wilson', rating: 4.1, seats: 3, cost: '$28.00', vehicle: 'Kia Optima', status: 'In Progress', contact: '555-6789' },
    { id: 8, time: '06:45 PM', date: 'Sun, Apr 22', pickup: '246 Walnut Circle', dropoff: 'Restaurant District', driver: 'Lisa Taylor', rating: 4.6, seats: 4, cost: '$20.75', vehicle: 'Volkswagen Jetta', status: 'Completed', contact: '555-0123' },
    { id: 9, time: '07:15 AM', date: 'Mon, Apr 23', pickup: '369 Spruce Way', dropoff: 'Business Park', driver: 'James Anderson', rating: 4.4, seats: 2, cost: '$17.25', vehicle: 'Subaru Legacy', status: 'Scheduled', contact: '555-4567' },
    { id: 10, time: '03:50 PM', date: 'Tue, Apr 24', pickup: '482 Ash Street', dropoff: 'Sports Arena', driver: 'Jennifer Martinez', rating: 4.8, seats: 3, cost: '$32.50', vehicle: 'Mazda 6', status: 'In Progress', contact: '555-8901' }
  ];

  const [selectedRide, setSelectedRide] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleViewDetails = (ride) => setSelectedRide(ride);
  const handleCloseModal = () => setSelectedRide(null);
  const handleJoinRide = () => setShowChatModal(true);
  const handleCloseChat = () => setShowChatModal(false);

  const handleSendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
    handleCloseChat();
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
          {rideData.map((ride) => (
            <article key={ride.id} className="view-ride-card">
              <img
                alt="Taxi car"
                className="view-ride-image"
                src={image}
              />
              <div className="view-ride-details">
                <div className="view-ride-time">
                  <span>{ride.time}</span>
                  <span>{ride.date}</span>
                </div>
                <p className="view-ride-pickup">Pick Up at {ride.pickup}</p>
                <p className="view-ride-dropoff">
                  <FaMapMarkerAlt className="view-ride-marker" />
                  Drop Off: {ride.dropoff}
                </p>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f59e0b',
                    color: 'black',
                    fontSize: '10px',
                    // fontWeight: '800',
                    borderRadius: '2px',
                    padding: '2px 8px',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: '#e69100',
                    },
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

<Dialog open={!!selectedRide} onClose={handleCloseModal} fullWidth maxWidth="sm">
  <DialogTitle style={{color:"#F1B92E"}}>
    RIDE DETAILS
    <IconButton
      aria-label="close"
      onClick={handleCloseModal}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
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
          <Typography variant="body1" sx={{ textAlign: 'right' }}>{selectedRide.driver}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Rating:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">{selectedRide.rating}</Typography>
            <FaStar style={{ color: '#f59e0b' }} />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Seats:</Typography>
          <Typography variant="body1">{selectedRide.seats}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Cost:</Typography>
          <Typography variant="body1">{selectedRide.cost}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Vehicle:</Typography>
          <Typography variant="body1">{selectedRide.vehicle}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Status:</Typography>
          <Typography variant="body1">{selectedRide.status}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Contact:</Typography>
          <Typography variant="body1">{selectedRide.contact}</Typography>
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
        NOTE: Please be at the pickup location 5 minutes before the pickup time.
      </Typography>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={handleJoinRide}
      variant="contained"
      sx={{
        backgroundColor: '#f59e0b',
        color: 'black',
        '&:hover': {
          backgroundColor: '#e69100',
        },
        width: '100%',
      }}
    >
      Join
    </Button>
  </DialogActions>
</Dialog>      
      <Dialog open={showChatModal} onClose={handleCloseChat} fullWidth maxWidth="sm">
        <DialogTitle style={{color:"#F1B92E"}}>
          CHAT
          <IconButton
            aria-label="close"
            onClick={handleCloseChat}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Driver"
            fullWidth
            margin="normal"
            value={selectedRide?.driver || ''}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            sx={{
              backgroundColor: '#f59e0b',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e69100',
              },
              width: '100%',
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewRide;
