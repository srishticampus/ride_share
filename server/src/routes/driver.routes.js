//server/src/routes/driver.routes.js
import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import * as driverValidation from '../validations/driver.validation.js';
import {validate} from '../middlewares/validation.middleware.js';
import { uploadDriverPhoto } from '../middlewares/upload.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

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

router.patch(
  '/:id',
  protect,
  uploadDriverPhoto,
  validate(driverValidation.updateDriverSchema),
  driverController.EditProfile
);

router.post(
  '/forgot-password',
  validate(driverValidation.forgotPasswordSchema),
  driverController.ForgotPassword
);

router.patch(
  '/:id/approve',
  protect,
  restrictTo('admin'),
  driverController.ApproveDriver
);

router.patch(
  '/:id/deactivate',
  protect,
  restrictTo('admin'),
  driverController.DeactivateDriver
);

router.patch(
  '/:id/activate',
  protect,
  restrictTo('admin'),
  driverController.ActivateDriver
);

router.get(
  '/',
  protect,
  driverController.viewDrivers
);

router.get(
  '/:id',
  protect,
  driverController.viewADriver
);

export default router;