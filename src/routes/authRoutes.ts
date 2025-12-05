import { Router } from 'express';
import * as authController from '../controllers/authController.ts';
import { authMiddleware } from '../middlewares/auth.ts';

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao@example.com"
 *               password:
 *                 type: string
 *                 example: "senha123456"
 *               confirmPassword:
 *                 type: string
 *                 example: "senha123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joao@example.com"
 *               password:
 *                 type: string
 *                 example: "senha123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha incorretos
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
