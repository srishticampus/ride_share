//server/src/routes/payment.routes.js
import express from 'express';
import PaymentController from '../controllers/payment.controller.js';
import { paymentSchema } from '../validations/payment.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - rideId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         rideId:
 *           type: string
 *         amount:
 *           type: number
 *         paymentMethod:
 *           type: string
 *           enum: [cash, card, mobile_money]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed]
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(paymentSchema), PaymentController.newPayment);

/**
 * @swagger
 * /payments/{id}/confirm:
 *   patch:
 *     summary: Confirm payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Payment confirmed
 *       404:
 *         description: Payment not found
 */
router.patch('/:id/confirm', PaymentController.confirmPayment);

/**
 * @swagger
 * /payments/completed:
 *   get:
 *     summary: Get all completed payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
router.get('/completed', PaymentController.showCompletedPayments);

export default router;