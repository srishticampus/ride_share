import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import DriverNav from './DriverNav';
import { Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import '../Style/ViewRide.css';
import apiService, { imageBaseUrl } from '../../Services/apiService';
import { toast } from 'react-toastify';
import { ClickAwayListener } from '@mui/material';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';
const ViewRequest = () => {
    const driverId = localStorage.getItem('driverId');
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [showProfileEditCard, setShowProfileEditCard] = useState(false);
    const [currentDriver, setCurrentDriver] = useState({});

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

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apiService.getAllRides();
                console.log(response);

                if (response.status === 'success') {
                    const ridesWithRequests = response.data.rides.filter(ride => {
                        const isDriverRide = ride.VehicleId?.driverId?._id === driverId;
                        const hasPendingRiders = ride.riderId && ride.riderId.length > 0;
                        // Check if any rider hasn't been accepted yet
                        const hasUnacceptedRiders = ride.riderId.some(rider =>
                            !ride.acceptedRiderId?.includes(rider._id)
                        );
                        return isDriverRide && hasPendingRiders && hasUnacceptedRiders;
                    });
                    setRequests(ridesWithRequests);
                }
            } catch (error) {
                console.error('Error fetching rides:', error);
                setError('Failed to load ride requests');
            }
        };
        fetchRequests();
    }, [driverId]);

    useEffect(() => {
        if (selectedRequest) {
            setLocalMessages(selectedRequest.messages || []);
        }
    }, [selectedRequest]);

    const handleOpenChat = (request) => {
        setSelectedRequest(request);
        setShowChatModal(true);
    };

    const handleCloseChat = () => {
        setShowChatModal(false);
        setSelectedRequest(null);
        setError(null);
    };

    const handleSendMessage = async () => {
        setError(null);
        try {
            if (!message.trim()) {
                setError('Message cannot be empty');
                return;
            }

            if (!selectedRequest?._id) {
                setError('No request selected');
                return;
            }
            const tempMessage = {
                text: message,
                sender: {
                    _id: driverId,
                    fullName: localStorage.getItem('driverName') || 'You'
                },
                senderType: 'Driver',
                createdAt: new Date().toISOString()
            };

            setLocalMessages(prev => [...prev, tempMessage]);
            setMessage('');

            const response = await apiService.updateRideMessage(
                selectedRequest._id,
                message.trim(),
                driverId,
                true
            );

            if (response.status === 'success') {
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req._id === selectedRequest._id
                            ? {
                                ...req,
                                messages: [...(req.messages || []), tempMessage]
                            }
                            : req
                    )
                );

                // Update selected request
                setSelectedRequest(prev => ({
                    ...prev,
                    messages: [...(prev.messages || []), tempMessage]
                }));
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to send message');
            setLocalMessages(prev => prev.slice(0, -1)); // Remove failed message
        }
    };

    const getSenderName = (message) => {
        if (
            message.senderType === 'Driver' ||
            message.sender?._id === driverId ||
            (typeof message.sender === 'string' && message.sender === driverId)
        ) {
            return 'You';
        }
        if (selectedRequest?.riderId?.some(rider => rider._id === message.sender?._id)) {
            return selectedRequest.riderId.find(rider => rider._id === message.sender?._id)?.fullName || 'Rider';
        }
        return message.sender?.fullName || 'Rider';
    };

    const handleApproveRequest = async (rideId, riderId) => {
        try {
            // Optimistic UI update - remove the request immediately
            setRequests(prevRequests =>
                prevRequests.map(request => {
                    if (request._id === rideId) {
                        return {
                            ...request,
                            riderId: request.riderId.filter(rider => rider._id !== riderId),
                            acceptedRiderId: [...(request.acceptedRiderId || []), riderId]
                        };
                    }
                    return request;
                }).filter(request =>
                    // Remove the ride completely if it has no more pending riders
                    request.riderId && request.riderId.length > 0
                )
            );

            // Then make the API call
            const response = await apiService.acceptRideRequest(rideId, { riderId });

            if (response.status !== 'success') {
                // If the API call fails, refetch the data to sync with server
                setError('Failed to accept ride request');
                setTimeout(() => setError(null), 3000);

                const fetchResponse = await apiService.getAllRides();
                if (fetchResponse.status === 'success') {
                    setRequests(fetchResponse.data.rides.filter(ride => {
                        const isDriverRide = ride.VehicleId?.driverId?._id === driverId;
                        const hasPendingRiders = ride.riderId && ride.riderId.length > 0;
                        const hasUnacceptedRiders = ride.riderId.some(rider =>
                            !ride.acceptedRiderId?.includes(rider._id)
                        );
                        return isDriverRide && hasPendingRiders && hasUnacceptedRiders;
                    }));
                }
                toast.success("Approved Successfully")
            } else {
                setSuccessMessage('Ride request accepted successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
                toast.error("Approved Failed")

            }
        } catch (error) {
            console.error('Error approving request:', error);
            setError(error.response?.data?.message || 'Failed to accept ride request');
            setTimeout(() => setError(null), 3000);

            // Refetch requests to sync with server
            const fetchResponse = await apiService.getAllRides();
            if (fetchResponse.status === 'success') {
                setRequests(fetchResponse.data.rides.filter(ride => {
                    const isDriverRide = ride.VehicleId?.driverId?._id === driverId;
                    const hasPendingRiders = ride.riderId && ride.riderId.length > 0;
                    const hasUnacceptedRiders = ride.riderId.some(rider =>
                        !ride.acceptedRiderId?.includes(rider._id)
                    );
                    return isDriverRide && hasPendingRiders && hasUnacceptedRiders;
                }));
            }
        }
    };
    const handleRejectRequest = async (rideId, riderId) => {
        try {
            setRequests(prevRequests =>
                prevRequests.map(request => {
                    if (request._id === rideId) {
                        return {
                            ...request,
                            riderId: request.riderId.filter(rider => rider._id !== riderId)
                        };
                    }
                    return request;
                }).filter(request =>
                    request.riderId && request.riderId.length > 0
                )
            );

            // Then make the API call
            const response = await apiService.rejectRideRequest(rideId, { riderId });

            if (response.status !== 'success') {
                setError('Failed to reject ride request');
                setTimeout(() => setError(null), 3000);
                const fetchResponse = await apiService.getAllRides();
                if (fetchResponse.status === 'success') {
                    setRequests(fetchResponse.data.rides.filter(ride => {
                        const isDriverRide = ride.VehicleId?.driverId?._id === driverId;
                        const hasPendingRiders = ride.riderId && ride.riderId.length > 0;
                        const hasUnacceptedRiders = ride.riderId.some(rider =>
                            !ride.acceptedRiderId?.includes(rider._id)
                        );
                        return isDriverRide && hasPendingRiders && hasUnacceptedRiders;
                    }));
                }
                toast.success("Rejected Successfully")
            } else {
                setSuccessMessage('Ride request rejected successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
                toast.error("Rejected Failed")
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            setError(error.response?.data?.message || 'Failed to reject ride request');
            setTimeout(() => setError(null), 3000);
            // Refetch requests to sync with server
            const fetchResponse = await apiService.getAllRides();
            if (fetchResponse.status === 'success') {
                setRequests(fetchResponse.data.rides.filter(ride => {
                    const isDriverRide = ride.VehicleId?.driverId?._id === driverId;
                    const hasPendingRiders = ride.riderId && ride.riderId.length > 0;
                    const hasUnacceptedRiders = ride.riderId.some(rider =>
                        !ride.acceptedRiderId?.includes(rider._id)
                    );
                    return isDriverRide && hasPendingRiders && hasUnacceptedRiders;
                }));
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
console.log(`${imageBaseUrl}${requests.riderId?.profilePicture}`);

    return (
        <div className="view-ride-container">
            <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />
            <main className="view-ride-main">
                <h1 className="payment-title" style={{ marginTop: "50px" }}>VIEW REQUESTS</h1>

                <section className="view-ride-grid">
                    {requests.length > 0 ? (
                        requests.flatMap((request) =>
                            request.riderId?.map((rider) => (
                                <article key={`${request._id}-${rider._id}`} className="view-req-card">
                                    <Avatar
                                        alt={rider.fullName || 'Rider'}
                                        src={`${imageBaseUrl}${rider.riderId?.profilePicture}`}
                                        sx={{ width: 70, height: 70 }}
                                    />
                                    <div className="view-ridereq-details">
                                        <p className="view-ride-pickup" style={{ color: "#f59e0b", fontSize: "18px", marginLeft: "40px" }}>
                                            {rider.fullName || 'Unknown Rider'}
                                        </p>
                                        <p className="view-Req-details">
                                            <EmailIcon className="view-ride-marker" />
                                            {rider.email || 'No email provided'}
                                        </p>
                                        <p className="view-Req-details">
                                            <PhoneIcon className="view-ride-marker" />
                                            {rider.phoneNumber || 'No phone provided'}
                                        </p>
                                        <p className="view-Req-details">
                                            <LocationOnIcon className="view-ride-marker" />
                                            {request.origin} to {request.destination}
                                        </p>
                                        <p className="view-Req-details">
                                            <PhoneIcon className="view-ride-marker" />
                                            {request.rideTime} on {formatDate(request.rideDate)}
                                        </p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleApproveRequest(request._id, rider._id)}
                                                sx={{
                                                    color: '#4caf50',
                                                    borderColor: '#4caf50',
                                                    '&:hover': {
                                                        borderColor: '#388e3c',
                                                        backgroundColor: 'rgba(76, 175, 80, 0.04)'
                                                    }
                                                }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleRejectRequest(request._id, rider._id)}
                                                sx={{
                                                    color: '#f44336',
                                                    borderRadius: "25px",
                                                    borderColor: '#f44336',
                                                    '&:hover': {
                                                        borderColor: '#d32f2f',
                                                        backgroundColor: 'rgba(244, 67, 54, 0.04)'
                                                    }
                                                }}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                className='view-ride-chat'
                                                variant="contained"
                                                onClick={() => handleOpenChat(request)}
                                                sx={{
                                                    backgroundColor: '#f59e0b',
                                                    color: 'white',
                                                }}
                                            >
                                                Chat
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '60vh',
                                width: '100vw'
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                No ride requests at the moment
                            </Typography>
                        </Box>
                    )}
                </section>
            </main>

            {/* Chat Dialog */}
            <Dialog open={showChatModal} onClose={handleCloseChat} fullWidth maxWidth="sm">
                <DialogTitle style={{ color: "#F1B92E" }}>
                    CHAT WITH RIDER
                    <IconButton onClick={handleCloseChat} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <FaTimes />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
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
                            const isCurrentUser = getSenderName(msg) === 'You';
                            const senderName = getSenderName(msg);

                            return (
                                <Box key={index} sx={{
                                    mb: 1,
                                    p: 1,
                                    maxWidth: '80%',
                                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                                    bgcolor: isCurrentUser ? '#e3f2fd' : '#f1f1f1',
                                    borderRadius: 2,
                                    borderBottomRightRadius: isCurrentUser ? 0 : 2,
                                    borderBottomLeftRadius: isCurrentUser ? 2 : 0
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
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

                    {/* Message Input */}
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
        </div>
    );
};

export default ViewRequest;