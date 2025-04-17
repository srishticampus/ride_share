//server/src/routes/rating.routes.js
import express from 'express';
import RatingController from '../controllers/rating.controller.js';
import { ratingSchema, updateRatingSchema } from '../validations/rating.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

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
 * tags:
 *   name: Ratings
 *   description: Rating management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Create new rating
 *     tags: [Ratings]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(ratingSchema), RatingController.newRating);

/**
 * @swagger
 * /ratings/{id}:
 *   patch:
 *     summary: Update rating
 *     tags: [Ratings]
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
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       404:
 *         description: Rating not found
 */
router.patch('/:id', validate(updateRatingSchema), RatingController.editRating);

/**
 * @swagger
 * /ratings/{id}:
 *   delete:
 *     summary: Delete rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found
 */
router.delete('/:id', RatingController.deleteRating);

/**
 * @swagger
 * /ratings:
 *   get:
 *     summary: Get all ratings
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 */
router.get('/', RatingController.viewAllRating);

export default router;