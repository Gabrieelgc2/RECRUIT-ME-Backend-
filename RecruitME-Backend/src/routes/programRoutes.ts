import { Router } from 'express';
import * as programController from '../controllers/programController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Obter todos os programas
 *     tags: [Programs]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo (bootcamp, estágio, workshop, curso)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status (open, closed, coming-soon)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *         description: Filtrar por tags (frontend, backend, dados, devops)
 *     responses:
 *       200:
 *         description: Programas obtidos com sucesso
 */
router.get('/', programController.getAllPrograms);

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Obter programa por ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programa obtido com sucesso
 *       404:
 *         description: Programa não encontrado
 */
router.get('/:id', programController.getProgramById);

/**
 * @swagger
 * /programs:
 *   post:
 *     summary: Criar novo programa (apenas para empresas)
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [bootcamp, estágio, workshop, curso]
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               enrollmentEndDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Programa criado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/', authMiddleware, programController.createProgram);

/**
 * @swagger
 * /programs/{id}:
 *   put:
 *     summary: Atualizar programa
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Programa atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Programa não encontrado
 */
router.put('/:id', authMiddleware, programController.updateProgram);

/**
 * @swagger
 * /programs/{id}:
 *   delete:
 *     summary: Deletar programa
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programa deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Programa não encontrado
 */
router.delete('/:id', authMiddleware, programController.deleteProgram);

export default router;
