import React, { useEffect, useState } from 'react';
import '../Style/RideHistory.css';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import apiService from '../../Services/apiService';

function RideHistory() {
    const [rides, setRides] = useState([]);
    const [selectedRiders, setSelectedRiders] = useState({});

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await apiService.getAllRides();
                const completedRides = response.data.rides.filter(ride => 
                    ride.status === "completed" && 
                    ride.successfulPayments && 
                    ride.successfulPayments.length > 0
                );
                
                const initialSelections = {};
                completedRides.forEach(ride => {
                    if (ride.successfulPayments?.length > 0) {
                        initialSelections[ride._id] = ride.successfulPayments[0].riderId._id;
                    }
                });
                setSelectedRiders(initialSelections);
                setRides(completedRides);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRides();
    }, []);
    
    const handleRiderChange = (rideId, riderId) => {
        setSelectedRiders(prev => ({ ...prev, [rideId]: riderId }));
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getSelectedPayment = (ride) => {
        if (!ride.successfulPayments || !selectedRiders[ride._id]) return null;
        return ride.successfulPayments.find(
            payment => payment.riderId._id === selectedRiders[ride._id]
        );
    };

    return (
        <div>
            <AdminNav />
            <AdminSidemenu />
            <div className="rideHistory-container">
                <h1 className="rideHistory-title">RIDE HISTORY</h1>
                
                {rides.length === 0 ? (
                    <div className="no-rides-message">
                        No completed rides available
                    </div>
                ) : (
                    <div className="rideHistory-cardsGrid">
                        {rides.map((ride) => {
                            const selectedPayment = getSelectedPayment(ride);
                            const selectedRider = ride.acceptedRiderId.find(
                                rider => rider._id === selectedRiders[ride._id]
                            ) || ride.acceptedRiderId[0];
                            
                            return (
                                <div key={ride._id} className="rideHistory-card">
                                    <div className="rideHistory-cardTop">
                                        <div className="rideHistory-id">
                                            <div className="rideHistory-iconCircle">
                                                <DirectionsCarFilledIcon style={{ color: 'black' }} />
                                            </div>
                                            <span>Ride ID : {ride._id.substring(ride._id.length - 8)}</span>
                                        </div>
                                        <div className="rideHistory-transactionInfo">
                                            <p className="rideHistory-transactionLabel">Transaction Date & Time</p>
                                            <p className="rideHistory-transactionValue">
                                                {selectedPayment ? formatDate(selectedPayment.paymentTime) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '15px 0' }}>
                                        <div className="rideHistory-detailsRow">
                                            <div className="rideHistory-detailItem">
                                                <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                                    <PersonIcon />
                                                </div>
                                                <div>
                                                    {ride.acceptedRiderId.length > 1 ? (
                                                        <div className="rideHistory-riderDropdown">
                                                            <span>Riders: </span>
                                                            <select
                                                                value={selectedRiders[ride._id] || ''}
                                                                onChange={(e) => handleRiderChange(ride._id, e.target.value)}
                                                                style={{fontSize: '14px'}}
                                                            >
                                                                {ride.acceptedRiderId.map((rider) => (
                                                                    <option key={rider._id} value={rider._id}>
                                                                        {rider.fullName} ({rider._id.substring(rider._id.length - 8)})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <span>
                                                            Rider: {selectedRider?.fullName || 'N/A'} 
                                                            ({selectedRider?._id.substring(selectedRider?._id.length - 8) || 'N/A'})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rideHistory-detailItem">
                                                <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                                    <PaymentIcon />
                                                </div>
                                                <span>
                                                    Payment ID: {selectedPayment?._id.substring(selectedPayment?._id.length - 8) || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="rideHistory-detailsRow">
                                            <div className="rideHistory-detailItem">
                                                <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                                    <LocalTaxiIcon />
                                                </div>
                                                <span>Driver ID: {ride.VehicleId?.driverId?._id.substring(ride.VehicleId.driverId._id.length - 8) || 'N/A'}</span>
                                            </div>
                                            <div className="rideHistory-detailItem">
                                                <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                                    <MonetizationOnIcon />
                                                </div>
                                                <span>Payment Method: {selectedPayment?.PaymentMode || 'N/A'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="rideHistory-detailsRow">
                                            <div className="rideHistory-detailItem">
                                                <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                                    <EmojiPeopleIcon />
                                                </div>
                                                <div>
                                                    <p className="rideHistory-locationInfo">Pick Up Location</p>
                                                    <p className="rideHistory-locationValue">{ride.origin || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="rideHistory-transactionInfo">
                                                <p className="rideHistory-locationInfo">{ride.rideDate && formatDate(ride.rideDate).split(',')[0]}</p>
                                                <p className="rideHistory-locationValue">{ride.rideTime || 'N/A'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="rideHistory-detailsRow">
                                            <div className="rideHistory-detailItem">
                                                <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                                    <LocationOnIcon />
                                                </div>
                                                <div>
                                                    <p className="rideHistory-locationInfo">Drop-Off Location</p>
                                                    <p className="rideHistory-locationValue">{ride.destination || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="rideHistory-transactionInfo">
                                                <p className="rideHistory-locationInfo">{ride.completedAt && formatDate(ride.completedAt).split(',')[0]}</p>
                                                <p className="rideHistory-locationValue">{ride.completedAt && formatDate(ride.completedAt).split(',')[1].trim()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="rideHistory-paymentSection">
                                            <h4 className="rideHistory-paymentAmount">Payment Amount: {selectedPayment?.amount || ride.price || 'N/A'}</h4>
                                            <span className="rideHistory-paidStatus">
                                                <CheckCircleIcon className="rideHistory-paidIcon" />
                                                PAID
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RideHistory;