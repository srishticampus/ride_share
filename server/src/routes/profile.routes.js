//server/src/routes/profile.routes.js
import express from 'express';
import ProfileController from '../controllers/profile.controller.js';
import { profileSchema, updateProfileSchema } from '../validations/profile.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

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
 *         workEndTime:
 *           type: string
 *         vehicleDetails:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profile management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create or update profile
 *     tags: [Profiles]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(profileSchema), ProfileController.setProfile);

/**
 * @swagger
 * /profiles/{id}:
 *   patch:
 *     summary: Update profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
router.patch('/:id', validate(updateProfileSchema), ProfileController.editProfile);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 */
router.get('/:id', ProfileController.aProfile);

router.use(restrictTo('admin'));

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles (Admin only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 */
router.get('/', ProfileController.ShowAllProfiles);

export default router;