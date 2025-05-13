//server/src/routes/driver.routes.js
import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import * as driverValidation from '../validations/driver.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadDriverPhoto } from '../middlewares/upload.middleware.js';
import { protect, restrictTo, verifyDriver } from '../middlewares/auth.middleware.js';

const router = express.Router();
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

// Public routes
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

// router.post(
//   '/forgot-password',
//   validate(driverValidation.forgotPasswordSchema),
//   driverController.ForgotPassword
// );
// router.patch(
//   '/me/update-password',
//   restrictTo('driver'),
//   validate(driverValidation.updatePasswordSchema),
//   driverController.updatePassword
// );

// router.patch(
//   '/reset-password/:token',
//   validate(driverValidation.resetPasswordSchema),
//   driverController.resetPassword
// );

// Protected routes (require authentication)
router.use(protect);

// Driver-specific routes
router.get('/me', restrictTo('driver'), driverController.getCurrentDriver);

router.patch(
  '/me/update',
  restrictTo('driver'),
  uploadDriverPhoto,
  validate(driverValidation.updateDriverSchema),
  driverController.updateCurrentDriver
);


router.get(
  '/me/vehicle',
  restrictTo('driver'),
  verifyDriver,
  driverController.getDriverVehicle
);

// Driver operational status
router.patch(
  '/me/go-online',
  restrictTo('driver'),
  verifyDriver,
  driverController.goOnline
);

router.patch(
  '/me/go-offline',
  restrictTo('driver'),
  verifyDriver,
  driverController.goOffline
);

// Admin-only routes
router.use(restrictTo('admin'));

router.get('/', driverController.viewDrivers);
router.get('/:id', driverController.viewADriver);
router.patch('/:id/approve', driverController.ApproveDriver);
router.patch('/:id/reject', driverController.rejectDriver);
router.patch('/:id/activate', driverController.ActivateDriver);
router.patch('/:id/deactivate', driverController.DeactivateDriver);

export default router;