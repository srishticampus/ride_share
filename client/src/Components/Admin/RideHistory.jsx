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
  {
    rideId: 'RD96587412',
    transactionDate: 'Apr 9 2025, 02:30 PM',
    riderId: 'USR965874',
    paymentId: 'PMT96587412365',
    driverId: 'DRV74589632',
    paymentMethod: 'Cash',
    pickupLocation: '456 Downtown',
    pickupTime: '9 APR 2025, 02:30 PM',
    dropoffLocation: 'Airport',
    dropoffTime: '9 APR 2025, 03:15 PM',
    amount: '750',
    status: 'PAID'
  },
  {
    rideId: 'RD32569874',
    transactionDate: 'Apr 8 2025, 08:45 AM',
    riderId: 'USR325698',
    paymentId: 'PMT32569874125',
    driverId: 'DRV12548796',
    paymentMethod: 'Online',
    pickupLocation: '789 Suburb',
    pickupTime: '8 APR 2025, 08:45 AM',
    dropoffLocation: 'Business District',
    dropoffTime: '8 APR 2025, 09:20 AM',
    amount: '600',
    status: 'PAID'
  },
  {
    rideId: 'RD74125896',
    transactionDate: 'Apr 7 2025, 06:15 PM',
    riderId: 'USR741258',
    paymentId: 'PMT74125896325',
    driverId: 'DRV96325874',
    paymentMethod: 'Credit Card',
    pickupLocation: 'Central Station',
    pickupTime: '7 APR 2025, 06:15 PM',
    dropoffLocation: 'North District',
    dropoffTime: '7 APR 2025, 06:50 PM',
    amount: '450',
    status: 'PAID'
  },
  {
    rideId: 'RD85214796',
    transactionDate: 'Apr 6 2025, 11:30 AM',
    riderId: 'USR852147',
    paymentId: 'PMT85214796325',
    driverId: 'DRV36985214',
    paymentMethod: 'Online',
    pickupLocation: 'West Mall',
    pickupTime: '6 APR 2025, 11:30 AM',
    dropoffLocation: 'East Park',
    dropoffTime: '6 APR 2025, 12:15 PM',
    amount: '550',
    status: 'PAID'
  }
];

function RideHistory() {
    return (
        <div>
            <AdminNav />
            <AdminSidemenu />
            <div className="ride-history-container">
                <h1 className="ride-history-title">RIDE HISTORY</h1>
                
                <div className="ride-cards-grid">
                    {rideData.map((ride, index) => (
                        <div key={index} className="ride-card">
                            {/* Top Section */}
                            <div className="ride-card-top">
                                <div className="ride-id">
                                    <div className="icon-circle">
                                        <DirectionsCarFilledIcon style={{ color: 'black' }} />
                                    </div>
                                    <span>Ride ID : {ride.rideId}</span>
                                </div>
                                <div className="transaction-info">
                                    <p className="transaction-label">Transaction Date & Time</p>
                                    <p className="transaction-value">{ride.transactionDate}</p>
                                </div>
                            </div>
                            
                            <div style={{ padding: '15px 0' }}>
                                <div className="ride-details-row">
                                    <div className="detail-item">
                                        <div className="icon-circle icon-circle-sm">
                                            <PersonIcon />
                                        </div>
                                        <span>Rider ID {ride.riderId}</span>
                                    </div>
                                    <div className="detail-item">
                                        <div className="icon-circle icon-circle-sm">
                                            <PaymentIcon />
                                        </div>
                                        <span>Payment ID : {ride.paymentId}</span>
                                    </div>
                                </div>
                                
                                {/* Row 2 */}
                                <div className="ride-details-row">
                                    <div className="detail-item">
                                        <div className="icon-circle icon-circle-sm">
                                            <LocalTaxiIcon />
                                        </div>
                                        <span>Driver ID: {ride.driverId}</span>
                                    </div>
                                    <div className="detail-item">
                                        <div className="icon-circle icon-circle-sm">
                                            <MonetizationOnIcon />
                                        </div>
                                        <span>Payment Method: {ride.paymentMethod}</span>
                                    </div>
                                </div>
                                
                                {/* Row 3 */}
                                <div className="ride-details-row">
                                    <div className="detail-item">
                                        <div className="icon-circle icon-circle-sm">
                                            <EmojiPeopleIcon />
                                        </div>
                                        <div>
                                            <p className="location-info">Pick Up Location</p>
                                            <p className="location-value">{ride.pickupLocation}</p>
                                        </div>
                                    </div>
                                    <div className="transaction-info">
                                        <p className="location-info">{ride.pickupTime.split(',')[0]}</p>
                                        <p className="location-value">{ride.pickupTime.split(',')[1]}</p>
                                    </div>
                                </div>
                                
                                {/* Row 4 */}
                                <div className="ride-details-row">
                                    <div className="detail-item">
                                        <div className="icon-circle icon-circle-sm">
                                            <LocationOnIcon />
                                        </div>
                                        <div>
                                            <p className="location-info">Drop-Off Location</p>
                                            <p className="location-value">{ride.dropoffLocation}</p>
                                        </div>
                                    </div>
                                    <div className="transaction-info">
                                        <p className="location-info">{ride.dropoffTime.split(',')[0]}</p>
                                        <p className="location-value">{ride.dropoffTime.split(',')[1]}</p>
                                    </div>
                                </div>
                                
                                {/* Row 5 */}
                                <div className="payment-section-admin">
                                    <h4 className="payment-amount">Payment Amount : {ride.amount}</h4>
                                    <span className="paid-status">
                                        <CheckCircleIcon className="paid-icon" />
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