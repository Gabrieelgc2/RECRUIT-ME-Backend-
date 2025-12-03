import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.ts';
import * as programService from '../services/programService.ts';
import { z } from 'zod';

const CreateProgramSchema = z.object({
  title: z.string().min(3, 'Título deve ter ao menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
  type: z.enum(['bootcamp', 'estágio', 'workshop', 'curso']),
  deadline: z.string().refine(val => !isNaN(Date.parse(val)), 'Data inválida'),
  enrollmentEndDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Data inválida'),
  maxParticipants: z.number().optional(),
  tags: z.array(z.string()),
  status: z.enum(['open', 'closed', 'coming-soon']).optional(),
  imageUrl: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional()
});

export async function getAllPrograms(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { type, status, tags } = req.query;

    const filters = {
      type: type as string | undefined,
      status: status as string | undefined,
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined
    };

    const programs = await programService.getAllPrograms(filters);

    res.status(200).json({
      message: 'Programas obtidos com sucesso',
      programs
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Erro ao obter programas',
      code: 'GET_PROGRAMS_ERROR'
    });
  }
}

export async function getProgramById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const program = await programService.getProgramById(id);

    res.status(200).json({
      message: 'Programa obtido com sucesso',
      program
    });
  } catch (error: any) {
    if (error.message === 'Programa não encontrado') {
      res.status(404).json({
        error: 'Programa não encontrado',
        code: 'PROGRAM_NOT_FOUND'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao obter programa',
      code: 'GET_PROGRAM_ERROR'
    });
  }
}

export async function createProgram(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const data = CreateProgramSchema.parse(req.body);

    // TODO: Verificar se o usuário é uma empresa
    // const user = await getUserById(req.userId);
    // const company = await getCompanyByUserId(req.userId);

    const program = await programService.createProgram('company-id-placeholder', {
      ...data,
      deadline: new Date(data.deadline),
      enrollmentEndDate: new Date(data.enrollmentEndDate)
    });

    res.status(201).json({
      message: 'Programa criado com sucesso',
      program
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao criar programa',
      code: 'CREATE_PROGRAM_ERROR'
    });
  }
}

export async function updateProgram(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;
    const data = req.body;

    // TODO: Verificar se o usuário é o dono do programa

    const program = await programService.updateProgram(id, {
      ...data,
      ...(data.deadline && { deadline: new Date(data.deadline) }),
      ...(data.enrollmentEndDate && { enrollmentEndDate: new Date(data.enrollmentEndDate) })
    });

    res.status(200).json({
      message: 'Programa atualizado com sucesso',
      program
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Programa não encontrado',
        code: 'PROGRAM_NOT_FOUND'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao atualizar programa',
      code: 'UPDATE_PROGRAM_ERROR'
    });
  }
}

export async function deleteProgram(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    // TODO: Verificar se o usuário é o dono do programa

    await programService.deleteProgram(id);

    res.status(200).json({
      message: 'Programa deletado com sucesso'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Programa não encontrado',
        code: 'PROGRAM_NOT_FOUND'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao deletar programa',
      code: 'DELETE_PROGRAM_ERROR'
    });
  }
}
