//server/src/routes/payment.routes.js
import express from 'express';
import PaymentController from '../controllers/payment.controller.js';
import { paymentSchema } from '../validations/payment.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment management
 */

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
 * /payments/payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payment]
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
 *       400:
 *         description: Bad request
 */
router.post(
  '/payment',
  protect,
  validate(paymentSchema),
  PaymentController.newPayment
);

/**
 * @swagger
 * /payments/confirmPayment/{id}:
 *   patch:
 *     summary: Confirm a payment
 *     tags: [Payment]
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
 *         description: Payment confirmed
 *       404:
 *         description: Payment not found
 */
router.patch(
  '/confirmPayment/:id',
  protect,
  PaymentController.confirmPayment
);

/**
 * @swagger
 * /payments/failedPayment/{id}:
 *   patch:
 *     summary: Mark payment as failed
 *     tags: [Payment]
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
 *         description: Payment marked as failed
 *       404:
 *         description: Payment not found
 */
router.patch(
  '/failedPayment/:id',
  protect,
  PaymentController.FailedPayment
);

/**
 * @swagger
 * /payments/completedPayment:
 *   get:
 *     summary: Get all completed payments
 *     tags: [Payment]
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
router.get(
  '/completedPayment',
  protect,
  PaymentController.showCompletedPayments
);

/**
 * @swagger
 * /payments/unCompletedPayment:
 *   get:
 *     summary: Get all failed payments
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of failed payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
router.get(
  '/unCompletedPayment',
  protect,
  PaymentController.showFailedPayments
);

export default router;