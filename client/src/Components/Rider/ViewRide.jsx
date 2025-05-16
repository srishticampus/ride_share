import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
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
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchRides = async () => {
    try {
      const response = await apiService.getAllRides();
      console.log(response);
      
      if (response.status === 'success') {
        const now = new Date();
        
        const filteredRides = response.data.rides.filter(ride => {
          // Check if current rider is already in acceptedRiderId or riderId
          const isInAcceptedRiders = ride.acceptedRiderId?.some(rider => rider._id === riderId);
          const isInRiders = ride.riderId?.some(rider => rider._id === riderId);
          
          // Combine date and time to create a Date object for the ride
          const rideDate = new Date(ride.rideDate);
          const [hours, minutes] = ride.rideTime.split(':').map(Number);
          rideDate.setHours(hours, minutes, 0, 0);
          
          // Only include rides that:
          // 1. The rider hasn't joined yet
          // 2. The ride is in the future
          // 3. The status is "pending"
          return !isInAcceptedRiders && !isInRiders && 
                 rideDate > now && 
                 ride.status === 'pending';
        });
        
        // Sort rides by date/time (soonest first)
        filteredRides.sort((a, b) => {
          const dateA = new Date(a.rideDate);
          const [hoursA, minutesA] = a.rideTime.split(':').map(Number);
          dateA.setHours(hoursA, minutesA, 0, 0);
          
          const dateB = new Date(b.rideDate);
          const [hoursB, minutesB] = b.rideTime.split(':').map(Number);
          dateB.setHours(hoursB, minutesB, 0, 0);
          
          return dateA - dateB;
        });
        
        setRides(filteredRides);
      }
    } catch (err) {
      console.log(err);
    }
  };
  fetchRides();
}, [riderId]);
  const handleViewDetails = (ride) => setSelectedRide(ride);
  const handleCloseModal = () => setSelectedRide(null);

  const handleJoinRide = async () => {
    try {
      if (!selectedRide?._id) {
        setError('No ride selected');
        return;
      }

      const response = await apiService.joinRide(selectedRide._id, riderId);
      
      if (response.status === 'success') {
        // Update the rides list to remove the joined ride
        setRides(prevRides => 
          prevRides.filter(ride => ride._id !== selectedRide._id)
        );
        
        // Close the details modal
        setSelectedRide(null);
      }
    } catch (err) {
      console.error('Error joining ride:', err);
      setError(err.message || 'Failed to join ride');
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
          {rides.map((ride) => {
            const isJoined = ride.acceptedRiderId?.some(rider => rider._id === riderId) || 
                            ride.riderId?.some(rider => rider._id === riderId);
            
            return (
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
                      backgroundColor: isJoined ? '#cccccc' : '#f59e0b',
                      color: 'black',
                      fontSize: '10px',
                      borderRadius: '2px',
                      padding: '4px 16px',
                      minWidth: 'auto',
                      '&:hover': { backgroundColor: isJoined ? '#cccccc' : '#e69100' },
                    }}
                    onClick={() => !isJoined && handleViewDetails(ride)}
                    disabled={isJoined}
                  >
                    {isJoined ? 'Already Joined' : 'View Details'}
                  </Button>
                </div>
              </article>
            );
          })}
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
          </Box>
        </DialogContent>
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
    </div>
  );
};

export default ViewRide;