import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollmentController.ts';
import { authMiddleware } from '../middlewares/auth.ts';

const router = Router();

/**
 * @swagger
 * /saved-programs:
 *   post:
 *     summary: Salvar programa
 *     tags: [SavedPrograms]
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
 *         description: Programa salvo com sucesso
 *       401:
 *         description: Não autenticado
 *       409:
 *         description: Programa já foi salvo
 */
router.post('/', authMiddleware, enrollmentController.saveProgram);

/**
 * @swagger
 * /saved-programs/{savedProgramId}:
 *   delete:
 *     summary: Remover programa dos salvos
 *     tags: [SavedPrograms]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: savedProgramId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programa removido dos salvos com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Programa salvo não encontrado
 */
router.delete('/:savedProgramId', authMiddleware, enrollmentController.unsaveProgram);

/**
 * @swagger
 * /saved-programs/my:
 *   get:
 *     summary: Obter meus programas salvos
 *     tags: [SavedPrograms]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Programas salvos obtidos com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get('/my', authMiddleware, enrollmentController.getUserSavedPrograms);

export default router;
