import React from 'react'
import '../Style/DriverPaymentHistory.css'
import DriverNav from './DriverNav'
import CreditCardIcon from '@mui/icons-material/CreditCard';

function DriverPaymentHistory() {
  const paymentHistory = [
    {
      id: 1,
      paymentId: 'PAY78901234',
      amount: '₹150',
      rideId: 'RIDE78901',
      riderId: 'RIDER7890',
      driverId: 'DRIVER123',
      method: 'UPI',
      invoice: 'INV52478965',
      date: 'April 28, 2025'
    },
    {
      id: 2,
      paymentId: 'PAY12345678',
      amount: '₹100',
      rideId: 'RIDE12345',
      riderId: 'RIDER1234',
      driverId: 'DRIVER123',
      method: 'Cash',
      invoice: 'INV12345678',
      date: 'April 25, 2025'
    },
    {
      id: 3,
      paymentId: 'PAY23456789',
      amount: '₹120',
      rideId: 'RIDE23456',
      riderId: 'RIDER2345',
      driverId: 'DRIVER123',
      method: 'Credit Card',
      invoice: 'INV23456789',
      date: 'April 22, 2025'
    },
    {
      id: 4,
      paymentId: 'PAY34567890',
      amount: '₹95',
      rideId: 'RIDE34567',
      riderId: 'RIDER3456',
      driverId: 'DRIVER123',
      method: 'Wallet',
      invoice: 'INV34567890',
      date: 'April 18, 2025'
    },
    {
      id: 5,
      paymentId: 'PAY45678901',
      amount: '₹110',
      rideId: 'RIDE45678',
      riderId: 'RIDER4567',
      driverId: 'DRIVER123',
      method: 'Debit Card',
      invoice: 'INV45678901',
      date: 'April 15, 2025'
    },
    {
      id: 6,
      paymentId: 'PAY56789012',
      amount: '₹85',
      rideId: 'RIDE56789',
      riderId: 'RIDER5678',
      driverId: 'DRIVER123',
      method: 'Cash',
      invoice: 'INV56789012',
      date: 'April 12, 2025'
    },
    {
      id: 7,
      paymentId: 'PAY67890123',
      amount: '₹130',
      rideId: 'RIDE67890',
      riderId: 'RIDER6789',
      driverId: 'DRIVER123',
      method: 'UPI',
      invoice: 'INV67890123',
      date: 'April 8, 2025'
    },
    {
      id: 8,
      paymentId: 'PAY78901234',
      amount: '₹105',
      rideId: 'RIDE78901',
      riderId: 'RIDER7890',
      driverId: 'DRIVER123',
      method: 'Cash',
      invoice: 'INV78901234',
      date: 'April 5, 2025'
    },
    {
      id: 9,
      paymentId: 'PAY89012345',
      amount: '₹90',
      rideId: 'RIDE89012',
      riderId: 'RIDER8901',
      driverId: 'DRIVER123',
      method: 'Wallet',
      invoice: 'INV89012345',
      date: 'April 3, 2025'
    },
    {
      id: 10,
      paymentId: 'PAY90123456',
      amount: '₹115',
      rideId: 'RIDE90123',
      riderId: 'RIDER9012',
      driverId: 'DRIVER123',
      method: 'Credit Card',
      invoice: 'INV90123456',
      date: 'April 1, 2025'
    }
  ];

  return (
    <div className="driver-payment-history">
      <DriverNav/>
      <h2 className="page-title-payment">PAYMENT HISTORY</h2>
      
      <div className="payment-container-driver">
        <div className="header-actions-driver">
          <h4 className="section-title">Your Payment History</h4>

        </div>
        <div className="month-header">April 2025</div>

        <div className="payment-list">
          {paymentHistory.map(payment => (
            <div key={payment.id} className="payment-card">
              <div className="payment-header">
                <div className="icon-container">
                  <CreditCardIcon className="payment-icon"/>
                </div>
                <h4 className="payment-info">
                  Payment ID: {payment.paymentId} • {payment.amount}
                </h4>
              </div>
              <p className="payment-detail">
                Ride ID: {payment.rideId} • Rider ID: {payment.riderId} • Driver ID: {payment.driverId}
              </p>
              <p className="payment-detail">
                Payment Method: {payment.method} • Invoice Number: {payment.invoice}
              </p>
              {/* <p className="payment-date">{payment.date}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DriverPaymentHistory