import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollmentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Se inscrever em um programa
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               programId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscrição realizada com sucesso
 *       401:
 *         description: Não autenticado
 *       409:
 *         description: Você já está inscrito neste programa
 */
router.post('/', authMiddleware, enrollmentController.enrollInProgram);

/**
 * @swagger
 * /enrollments/{enrollmentId}:
 *   delete:
 *     summary: Cancelar inscrição
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscrição cancelada com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Inscrição não encontrada
 */
router.delete('/:enrollmentId', authMiddleware, enrollmentController.cancelEnrollment);

/**
 * @swagger
 * /enrollments/my:
 *   get:
 *     summary: Obter minhas inscrições
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Inscrições obtidas com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get('/my', authMiddleware, enrollmentController.getUserEnrollments);

export default router;
