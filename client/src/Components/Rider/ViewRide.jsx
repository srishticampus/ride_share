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
import { toast } from 'react-toastify';
import { ClickAwayListener } from '@mui/material';
import RiderViewProfile from './RiderViewProfile';
import RiderEditProfile from './RiderEditProfile';

const ViewRide = () => {
  const riderId = localStorage.getItem('riderId');
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile state
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEditCard, setShowProfileEditCard] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Profile handlers
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

  // Fetch current user
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

  // Existing ride fetching logic
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await apiService.getAllRides();
        if (response.status === 'success') {
          const now = new Date();
          const filteredRides = response.data.rides.filter(ride => {
            const isInAcceptedRiders = ride.acceptedRiderId?.some(rider => rider._id === riderId);
            const isInRiders = ride.riderId?.some(rider => rider._id === riderId);
            const rideDate = new Date(ride.rideDate);
            const [hours, minutes] = ride.rideTime.split(':').map(Number);
            rideDate.setHours(hours, minutes, 0, 0);
            return !isInAcceptedRiders && !isInRiders &&
              rideDate > now &&
              ride.status === 'pending';
          });
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

  // Search functionality
  const filteredRides = rides.filter(ride => {
    const searchLower = searchQuery.toLowerCase();
    const driverName = ride.VehicleId?.driverId?.fullname?.toLowerCase() || '';
    const vehicleMake = ride.VehicleId?.vehicleMake?.toLowerCase() || '';
    const vehicleModel = ride.VehicleId?.vehicleModel?.toLowerCase() || '';
    return (
      ride.origin.toLowerCase().includes(searchLower) ||
      ride.destination.toLowerCase().includes(searchLower) ||
      driverName.includes(searchLower) ||
      vehicleMake.includes(searchLower) ||
      vehicleModel.includes(searchLower)
    );
  });

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
        setRides(prevRides => prevRides.filter(ride => ride._id !== selectedRide._id));
        setSelectedRide(null);
        toast.success('Ride joined successfully');
      }
    } catch (err) {
      console.error('Error joining ride:', err);
      setError(err.message || 'Failed to join ride');
      toast.error('Ride joined Unsuccessfully');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="view-ride-container">
      <RiderNav onAvatarClick={onAvatarClick} />

      {/* Profile components */}
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

      <main className="view-ride-main">
        <h1 className="view-ride-title">RIDE</h1>
        <div className="view-ride-header">
          <div className="view-ride-subtitle">VIEW RIDES</div>
          <RiderSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <section className="view-ride-grid">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => {
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
            })
          ) : (
            <Box sx={{
              width: '100%',
              textAlign: 'center',
              p: 3,
              mt: 4,
              backgroundColor: '#fff9e6',
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ color: '#666', position: 'relative', left: '500px' }}>
                {searchQuery ? 'No rides match your search' : 'Rides not available at the moment'}
              </Typography>
            </Box>
          )}
        </section>
      </main>

      <Dialog open={!!selectedRide} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle style={{ color: "#F1B92E" }}>
          RIDE DETAILS
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRide && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Driver:</Typography>
                <Typography variant="body1">{selectedRide.VehicleId.driverId.fullname}</Typography>
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
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#fff9e6', borderRadius: 1, textAlign: 'center' }}>
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