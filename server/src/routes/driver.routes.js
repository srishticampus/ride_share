import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import * as driverValidation from '../validations/driver.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadDriverPhoto } from '../middlewares/upload.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post(
  '/register',
  uploadDriverPhoto,
  validate(driverValidation.driverRegistrationSchema),
  driverController.DriverRegistration
);

router.post(
  '/login',
  validate(driverValidation.driverLoginSchema),
  driverController.login
);

router.post(
  '/findByDriverPh',
  validate(driverValidation.findByPhoneSchema),
  driverController.FindByPhonenumber
);

router.post(
  '/forgotPass/:phoneNumber',
  validate(driverValidation.forgotPasswordSchema),
  driverController.ForgotPassword
);

// Protected routes (require authentication)
router.use(protect);

// Driver-specific routes (authenticated drivers)
router.get('/getDriver', driverController.getDriver);
router.patch(
  '/:id',
  uploadDriverPhoto,
  validate(driverValidation.updateDriverSchema),
  driverController.EditProfile
);

// Admin-only routes (require admin role)
router.use(restrictTo('admin'));
router.get('/showAllDrivers', driverController.viewDrivers);
router.patch('/:id/approve', driverController.ApproveDriver);
router.patch('/editDriverProfile', driverController.EditProfile);

export default router;