import React, { useState } from 'react';
import RiderNav from './RiderNav';
import { Button, Divider } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import '../Style/RiderRideHistory.css';
import { Link } from 'react-router-dom';
const rideHistoryData = [
  {
    id: 1,
    rideId: 'RD25589',
    date: 'April 10, 2025',
    pickUpLocation: '125, City Center',
    dropOffLocation: '78, Downtown',
    pickUpTime: 'Apr 10 2025, 10:00 AM',
    dropOffTime: 'Apr 10 2025, 10:30 AM',
    paymentAmount: '₹100',
    paymentId: 'PAY78945612',
    riderId: 'RID125487',
    driverId: 'DRV889565',
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 10 2025, 10:35 AM'
  },
  {
    id: 2,
    rideId: 'RD36589',
    date: 'April 9, 2025',
    pickUpLocation: '45, Mall Road',
    dropOffLocation: '22, Business Park',
    pickUpTime: 'Apr 9 2025, 02:30 PM',
    dropOffTime: 'Apr 9 2025, 03:00 PM',
    paymentAmount: '₹150',
    paymentId: 'PAY36589654',
    riderId: 'RID125487',
    driverId: 'DRV745896',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 9 2025, 03:05 PM'
  },
  {
    id: 3,
    rideId: 'RD78541',
    date: 'April 8, 2025',
    pickUpLocation: '89, Suburb Lane',
    dropOffLocation: 'Central Station',
    pickUpTime: 'Apr 8 2025, 08:45 AM',
    dropOffTime: 'Apr 8 2025, 09:15 AM',
    paymentAmount: '₹200',
    paymentId: 'PAY78541236',
    riderId: 'RID125487',
    driverId: 'DRV125487',
    paymentMethod: 'Wallet',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 8 2025, 09:20 AM'
  },
  {
    id: 4,
    rideId: 'RD96587',
    date: 'April 7, 2025',
    pickUpLocation: '12, Park Street',
    dropOffLocation: 'Airport Terminal',
    pickUpTime: 'Apr 7 2025, 06:15 PM',
    dropOffTime: 'Apr 7 2025, 07:00 PM',
    paymentAmount: '₹350',
    paymentId: 'PAY96587412',
    riderId: 'RID125487',
    driverId: 'DRV963258',
    paymentMethod: 'Cash',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 7 2025, 07:05 PM'
  },
  {
    id: 5,
    rideId: 'RD32569',
    date: 'April 6, 2025',
    pickUpLocation: '56, Lake View',
    dropOffLocation: '34, Tech Park',
    pickUpTime: 'Apr 6 2025, 11:30 AM',
    dropOffTime: 'Apr 6 2025, 12:00 PM',
    paymentAmount: '₹180',
    paymentId: 'PAY32569874',
    riderId: 'RID125487',
    driverId: 'DRV369852',
    paymentMethod: 'Debit Card',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 6 2025, 12:05 PM'
  },
  {
    id: 6,
    rideId: 'RD74125',
    date: 'April 5, 2025',
    pickUpLocation: '90, Hillside Avenue',
    dropOffLocation: '65, Market Square',
    pickUpTime: 'Apr 5 2025, 05:45 PM',
    dropOffTime: 'Apr 5 2025, 06:15 PM',
    paymentAmount: '₹120',
    paymentId: 'PAY74125896',
    riderId: 'RID125487',
    driverId: 'DRV852147',
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 5 2025, 06:20 PM'
  },
  {
    id: 7,
    rideId: 'RD85214',
    date: 'April 4, 2025',
    pickUpLocation: '33, Riverfront',
    dropOffLocation: '78, University Campus',
    pickUpTime: 'Apr 4 2025, 09:00 AM',
    dropOffTime: 'Apr 4 2025, 09:40 AM',
    paymentAmount: '₹220',
    paymentId: 'PAY85214796',
    riderId: 'RID125487',
    driverId: 'DRV741258',
    paymentMethod: 'Wallet',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 4 2025, 09:45 AM'
  },
  {
    id: 8,
    rideId: 'RD96325',
    date: 'April 3, 2025',
    pickUpLocation: '21, Old Town',
    dropOffLocation: '43, New District',
    pickUpTime: 'Apr 3 2025, 03:15 PM',
    dropOffTime: 'Apr 3 2025, 03:50 PM',
    paymentAmount: '₹170',
    paymentId: 'PAY96325874',
    riderId: 'RID125487',
    driverId: 'DRV325698',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Completed',
    transactionDate: 'Apr 3 2025, 03:55 PM'
  }
];

function RiderRideHistory() {
  const [selectedRide, setSelectedRide] = useState(null);

  const handleViewMore = (ride) => {
    setSelectedRide(ride);
  };

  return (
    <div className="rider-ride-history-container">
      <RiderNav />
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
          <div className="month-header">April 2025</div>
        </div>

        <div className="ride-history-main">
          <div className="ride-list">
            {rideHistoryData.map((ride) => (
              <div key={ride.id} className="ride-card">
                <div className="ride-icon">
                  <HistoryIcon />
                </div>
                <div className="ride-info">
                  <h4>Ride ID: {ride.rideId}</h4>
                  <p>Pick Up: {ride.pickUpLocation}</p>
                  <p>Payment Amount: {ride.paymentAmount}</p>
                  <div className="ride-actions">
                    <Button 
                      variant="contained" 
                      style={{ backgroundColor: '#F1B92E', color: 'black' }}
                      onClick={() => handleViewMore(ride)}
                    >
                      View More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedRide && (
            <div className="ride-details">
              <div className="payment-section">
                <h3 className="section-header">Payment</h3>
                <Divider />
                <div className="details-grid">
                  <div className="details-left">
                    <p><strong>Payment ID:</strong> {selectedRide.paymentId}</p>
                    <p><strong>Rider ID:</strong> {selectedRide.riderId}</p>
                    <p><strong>Payment Amount:</strong> {selectedRide.paymentAmount}</p>
                    <p><strong>Payment Status:</strong> {selectedRide.paymentStatus}</p>
                  </div>
                  <div className="details-right">
                    <p><strong>Ride ID:</strong> {selectedRide.rideId}</p>
                    <p><strong>Driver ID:</strong> {selectedRide.driverId}</p>
                    <p><strong>Payment Method:</strong> {selectedRide.paymentMethod}</p>
                    <p><strong>Transaction Date & Time:</strong> {selectedRide.transactionDate}</p>
                  </div>
                </div>
              </div>

              <div className="route-section">
                <h3 className="section-header">Route</h3>
                <Divider />
                <div className="details-grid">
                  <div className="details-left">
                    <p><strong>Pick Up Location:</strong> {selectedRide.pickUpLocation}</p>
                    <p><strong>Pick Up Date & Time:</strong> {selectedRide.pickUpTime}</p>
                  </div>
                  <div className="details-right">
                    <p><strong>Drop-Off Location:</strong> {selectedRide.dropOffLocation}</p>
                    <p><strong>Drop-Off Date & Time:</strong> {selectedRide.dropOffTime}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiderRideHistory;