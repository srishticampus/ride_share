//server/src/routes/index.js
import express from 'express';
import adminRoutes from './admin.routes.js';
import driverRoutes from './driver.routes.js';
import userRoutes from './user.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import profileRoutes from './profile.routes.js';
import rideRoutes from './ride.routes.js';
import rideRequestRoutes from './rideReq.routes.js';
import paymentRoutes from './payment.routes.js';
import ratingRoutes from './rating.routes.js';
import disputeRoutes from './disputes.routes.js';

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/drivers', driverRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/profiles', profileRoutes);
router.use('/rides', rideRoutes);
router.use('/ride-requests', rideRequestRoutes);
router.use('/payments', paymentRoutes);
router.use('/ratings', ratingRoutes);
router.use('/disputes', disputeRoutes);

export default router;