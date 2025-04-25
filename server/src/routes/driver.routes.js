//server/src/routes/driver.routes.js
import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import * as driverValidation from '../validations/driver.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadDriverPhoto } from '../middlewares/upload.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/getDriver', driverController.getDriver);

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - phoneNumber
 *         - licenseNumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         fullName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         licenseNumber:
 *           type: string
 *         profilePicture:
 *           type: string
 *         isApproved:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management endpoints
 */

/**
 * @swagger
 * /drivers/register:
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       201:
 *         description: Driver registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Validation error
 */
router.post(
  '/register',
  uploadDriverPhoto,
  validate(driverValidation.driverRegistrationSchema),
  driverController.DriverRegistration
);

/**
 * @swagger
 * /drivers/login:
 *   post:
 *     summary: Authenticate driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Invalid credentials
 */

router.post(
  '/login',
  validate(driverValidation.driverLoginSchema),
  driverController.login
);


/**
 * @swagger
 * /drivers/{id}:
 *   patch:
 *     summary: Update driver profile
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden - Can only update own profile
 */
router.patch(
  '/:id',
  uploadDriverPhoto,
  validate(driverValidation.updateDriverSchema),
  driverController.EditProfile
);


/**
 * @swagger
 * /drivers/{id}/approve:
 *   patch:
 *     summary: Approve driver (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Driver approved
 *       404:
 *         description: Driver not found
 */
/**
 * @swagger
 * /drivers/findByDriverPh:
 *   post:
 *     summary: Find driver by phone number
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Driver's phone number
 *     responses:
 *       200:
 *         description: Driver found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Phone number is required
 *       404:
 *         description: No driver found with this phone number
 */

router.post(
  '/findByDriverPh',
  validate(driverValidation.findByPhoneSchema),
  driverController.FindByPhonenumber
);
/**
 * @swagger
 * /drivers/forgotPass/{phoneNumber}:
 *   post:
 *     summary: Reset driver's password
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver's phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Phone number is required
 *       404:
 *         description: No driver found with this phone number
 */

router.post(
  '/forgotPass/:phoneNumber',
  validate(driverValidation.forgotPasswordSchema),
  driverController.ForgotPassword
);


/**
 * @swagger
 * /driver/{id}/approve:
 *  patch:
 *    summary: Approve driver (Admin only)
 *   tags: [Drivers]
 *   security:
 *     - bearerAuth: []
 *  parameters:
 *    - in: path
 *     name: id
 *    required: true
 *    description: Driver ID
 *   responses:
 *    200:
 *     description: Driver approved
 *    content:
 *      application/json:
 *        schema:
 *         type: object
 *        properties:
 *         status:
 *          type: string
 *         message:
 *         type: string
*/
router.use(protect);

router.use(restrictTo('admin'));
router.get('/showAllDrivers', driverController.viewDrivers);

router.patch('/:id/approve', driverController.ApproveDriver);
/**
 * @swagger
 * /drivers/showAllDrivers:
 *   get:
 *     summary: Get all drivers (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 */

/**
 * @swagger
 * /drivers/editDriverProfile:
 *   patch:
 *     summary: Edit driver profile (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: No driver found with that ID
 */
router.patch('/editDriverProfile',driverController.EditProfile);

export default router;