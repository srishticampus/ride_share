import React, { useEffect, useState } from 'react'
import '../Style/DriverPaymentHistory.css'
import DriverNav from './DriverNav'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import apiService from '../../Services/apiService';

function DriverPaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const driverId = localStorage.getItem('driverId');

useEffect(() => {
  const fetchRides = async () => {
    try {
      const response = await apiService.getAllRides();
      if (response.status === 'success' && response.data.rides.length > 0) {
        // Filter rides with safe optional chaining
        const driverRides = response.data.rides.filter(ride => 
          ride.driverId?._id === driverId || 
          ride.VehicleId?.driverId?._id === driverId
        );

        // Extract payments from filtered rides
        const allPayments = driverRides.flatMap(ride => 
          ride.successfulPayments?.map(payment => ({
            id: payment._id,
            paymentId: payment._id,
            amount: `₹${payment.amount}`,
            rideId: ride._id,
            riderId: payment.riderId?._id,
            riderName: payment.riderId?.fullName,
            method: payment.PaymentMode || 'UPI',
            invoice: `INV${payment._id.slice(-8).toUpperCase()}`,
            date: new Date(payment.paymentTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            paymentTime: payment.paymentTime,
            rideDetails: {
              origin: ride.origin,
              destination: ride.destination,
              rideDate: ride.rideDate
            }
          })) || []
        );

        // Sort by payment time (newest first)
        allPayments.sort((a, b) => new Date(b.paymentTime) - new Date(a.paymentTime));
        setPaymentHistory(allPayments);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchRides();
}, [driverId]);

  if (loading) {
    return <div className="driver-payment-history">
      <DriverNav/>
      Loading...</div>;
  }

  const paymentsByMonth = paymentHistory.reduce((acc, payment) => {
    const monthYear = new Date(payment.paymentTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(payment);
    return acc;
  }, {});

  return (
    <div className="driver-payment-history">
      <DriverNav/>
      <h2 className="page-title-payment">PAYMENT HISTORY</h2>
      
      <div className="payment-container-driver">
        <div className="header-actions-driver">
          <h4 className="section-title">Your Payment History</h4>
        </div>

        {Object.entries(paymentsByMonth).map(([monthYear, payments]) => (
          <div key={monthYear}>
            {/* <div className="month-header">{monthYear}</div> */}
            <div className="payment-list">
              {payments.map(payment => (
                <div key={payment.id} className="payment-card">
                  <div className="payment-header">
                    <div className="icon-container">
                      <CreditCardIcon className="payment-icon"/>
                    </div>
                    <h4 className="payment-info">
                      Payment ID: {payment.paymentId.slice(-8)} • {payment.amount}
                    </h4>
                  </div>
                  <p className="payment-detail">
                    Ride: {payment.rideDetails.origin} → {payment.rideDetails.destination}
                  </p>
                  <p className="payment-detail">
                    Rider: {payment.riderName} 
                  </p>
                  <p className="payment-detail">
                    Payment Method: {payment.method} • {payment.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {paymentHistory.length === 0 && (
          <div className="no-payments">
            <p>No payment history found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverPaymentHistory;