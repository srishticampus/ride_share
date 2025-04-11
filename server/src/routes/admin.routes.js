//server/src/routes/admin.routes.js
import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import { loginSchema } from '../validations/admin.validation.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/loginAdmin:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin logged in successfully
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
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
router.post('/loginAdmin', validate(loginSchema), AdminController.login);

export default router;