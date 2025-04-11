//server/src/routes/profile.routes.js
import express from 'express';
import ProfileController from '../controllers/profile.controller.js';
import { profileSchema, updateProfileSchema } from '../validations/profile.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - userId
 *         - commuteStart
 *         - commuteEnd
 *       properties:
 *         userId:
 *           type: string
 *         commuteStart:
 *           type: string
 *         commuteEnd:
 *           type: string
 *         workStartTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *         workEndTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *         vehicleDetails:
 *           type: string
 */

/**
 * @swagger
 * /api/addprofile:
 *   post:
 *     summary: Create or update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/addprofile',
  protect,
  validate(profileSchema),
  ProfileController.setProfile
);

/**
 * @swagger
 * /api/editprofile/{id}:
 *   patch:
 *     summary: Update profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.patch(
  '/editprofile/:id',
  protect,
  validate(updateProfileSchema),
  ProfileController.editProfile
);

/**
 * @swagger
 * /api/allprofile:
 *   get:
 *     summary: Get all profiles (Admin only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 */
router.get(
  '/allprofile',
  protect,
  restrictTo('admin'),
  ProfileController.ShowAllProfiles
);

/**
 * @swagger
 * /api/aProfile/{id}:
 *   get:
 *     summary: Get a single profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile details
 *       404:
 *         description: Profile not found
 */
router.get(
  '/aProfile/:id',
  protect,
  ProfileController.aProfile
);

export default router;