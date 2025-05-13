import React from 'react';
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

const rideData = [
  {
    rideId: 'RD78542139',
    transactionDate: 'Apr 10 2025, 10:00 AM',
    riderId: 'USR125487',
    paymentId: 'PMT32655665565',
    driverId: 'DRV88956556',
    paymentMethod: 'Online',
    pickupLocation: '123 City',
    pickupTime: '10 APR 2025, 10:00 AM',
    dropoffLocation: 'New City',
    dropoffTime: '10 APR 2025, 10:30 AM',
    amount: '500',
    status: 'PAID'
  },
  // ... (rest of the rideData remains the same)
];

function RideHistory() {
    return (
        <div>
            <AdminNav />
            <AdminSidemenu />
            <div className="rideHistory-container">
                <h1 className="rideHistory-title">RIDE HISTORY</h1>
                
                <div className="rideHistory-cardsGrid">
                    {rideData.map((ride, index) => (
                        <div key={index} className="rideHistory-card">
                            {/* Top Section */}
                            <div className="rideHistory-cardTop">
                                <div className="rideHistory-id">
                                    <div className="rideHistory-iconCircle">
                                        <DirectionsCarFilledIcon style={{ color: 'black' }} />
                                    </div>
                                    <span>Ride ID : {ride.rideId}</span>
                                </div>
                                <div className="rideHistory-transactionInfo">
                                    <p className="rideHistory-transactionLabel">Transaction Date & Time</p>
                                    <p className="rideHistory-transactionValue">{ride.transactionDate}</p>
                                </div>
                            </div>
                            
                            <div style={{ padding: '15px 0' }}>
                                <div className="rideHistory-detailsRow">
                                    <div className="rideHistory-detailItem">
                                        <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                            <PersonIcon />
                                        </div>
                                        <span>Rider ID {ride.riderId}</span>
                                    </div>
                                    <div className="rideHistory-detailItem">
                                        <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                            <PaymentIcon />
                                        </div>
                                        <span>Payment ID : {ride.paymentId}</span>
                                    </div>
                                </div>
                                
                                {/* Row 2 */}
                                <div className="rideHistory-detailsRow">
                                    <div className="rideHistory-detailItem">
                                        <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                            <LocalTaxiIcon />
                                        </div>
                                        <span>Driver ID: {ride.driverId}</span>
                                    </div>
                                    <div className="rideHistory-detailItem">
                                        <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                            <MonetizationOnIcon />
                                        </div>
                                        <span>Payment Method: {ride.paymentMethod}</span>
                                    </div>
                                </div>
                                
                                {/* Row 3 */}
                                <div className="rideHistory-detailsRow">
                                    <div className="rideHistory-detailItem">
                                        <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                            <EmojiPeopleIcon />
                                        </div>
                                        <div>
                                            <p className="rideHistory-locationInfo">Pick Up Location</p>
                                            <p className="rideHistory-locationValue">{ride.pickupLocation}</p>
                                        </div>
                                    </div>
                                    <div className="rideHistory-transactionInfo">
                                        <p className="rideHistory-locationInfo">{ride.pickupTime.split(',')[0]}</p>
                                        <p className="rideHistory-locationValue">{ride.pickupTime.split(',')[1]}</p>
                                    </div>
                                </div>
                                
                                {/* Row 4 */}
                                <div className="rideHistory-detailsRow">
                                    <div className="rideHistory-detailItem">
                                        <div className="rideHistory-iconCircle rideHistory-iconCircle-sm">
                                            <LocationOnIcon />
                                        </div>
                                        <div>
                                            <p className="rideHistory-locationInfo">Drop-Off Location</p>
                                            <p className="rideHistory-locationValue">{ride.dropoffLocation}</p>
                                        </div>
                                    </div>
                                    <div className="rideHistory-transactionInfo">
                                        <p className="rideHistory-locationInfo">{ride.dropoffTime.split(',')[0]}</p>
                                        <p className="rideHistory-locationValue">{ride.dropoffTime.split(',')[1]}</p>
                                    </div>
                                </div>
                                
                                {/* Row 5 */}
                                <div className="rideHistory-paymentSection">
                                    <h4 className="rideHistory-paymentAmount">Payment Amount : {ride.amount}</h4>
                                    <span className="rideHistory-paidStatus">
                                        <CheckCircleIcon className="rideHistory-paidIcon" />
                                        {ride.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RideHistory;