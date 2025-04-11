//server/src/routes/rating.routes.js
import express from 'express';
import RatingController from '../controllers/rating.controller.js';
import { ratingSchema, updateRatingSchema } from '../validations/rating.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rating
 *   description: Rating management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       required:
 *         - rideId
 *         - reviewerId
 *         - rating
 *       properties:
 *         rideId:
 *           type: string
 *         reviewerId:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         reviewText:
 *           type: string
 */

/**
 * @swagger
 * /api/rating:
 *   post:
 *     summary: Create a new rating
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/rating',
  protect,
  validate(ratingSchema),
  RatingController.newRating
);

/**
 * @swagger
 * /api/editRating/{id}:
 *   patch:
 *     summary: Update a rating
 *     tags: [Rating]
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
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       404:
 *         description: Rating not found
 */
router.patch(
  '/editRating/:id',
  protect,
  validate(updateRatingSchema),
  RatingController.editRating
);

/**
 * @swagger
 * /api/deleteRating/{id}:
 *   delete:
 *     summary: Delete a rating
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found
 */
router.delete(
  '/deleteRating/:id',
  protect,
  RatingController.deleteRating
);

/**
 * @swagger
 * /api/viewAllRating:
 *   get:
 *     summary: Get all ratings
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 */
router.get(
  '/viewAllRating',
  protect,
  RatingController.viewAllRating
);

/**
 * @swagger
 * /api/viewARating/{id}:
 *   get:
 *     summary: Get a single rating
 *     tags: [Rating]
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
 *         description: Rating details
 *       404:
 *         description: Rating not found
 */
router.get(
  '/viewARating/:id',
  protect,
  RatingController.viewARating
);

export default router;