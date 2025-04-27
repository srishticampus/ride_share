// server/src/routes/driverComplaint.routes.js
import express from 'express';
import DriverComplaints from '../controllers/DriverComplaints.controller.js';
import { driverComplaintSchema } from '../validations/driverComplaint.validation.js';

const router = express.Router();

router.post('/complanints',DriverComplaints.createComplaint );
// router.get('/driver/:driverId', getComplaints);
// router.get('/:id', getComplaintById);
// router.patch('/:id/status', updateComplaintStatus);

export default router;