import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.ts';
import * as enrollmentService from '../services/enrollmentService.ts';

export async function enrollInProgram(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { programId } = req.body;

    if (!programId) {
      res.status(400).json({ error: 'programId é obrigatório' });
      return;
    }

    const enrollment = await enrollmentService.enrollInProgram(req.userId, programId);

    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      enrollment
    });
  } catch (error: any) {
    if (error.message === 'Você já está inscrito neste programa') {
      res.status(409).json({
        error: 'Você já está inscrito neste programa',
        code: 'ALREADY_ENROLLED'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao se inscrever',
      code: 'ENROLL_ERROR'
    });
  }
}

export async function cancelEnrollment(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { enrollmentId } = req.params;

    // TODO: Verificar se o enrollment pertence ao usuário

    await enrollmentService.cancelEnrollment(req.userId, enrollmentId);

    res.status(200).json({
      message: 'Inscrição cancelada com sucesso'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Inscrição não encontrada',
        code: 'ENROLLMENT_NOT_FOUND'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao cancelar inscrição',
      code: 'CANCEL_ENROLLMENT_ERROR'
    });
  }
}

export async function getUserEnrollments(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const enrollments = await enrollmentService.getUserEnrollments(req.userId);

    res.status(200).json({
      message: 'Inscrições obtidas com sucesso',
      enrollments,
      count: enrollments.length
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Erro ao obter inscrições',
      code: 'GET_ENROLLMENTS_ERROR'
    });
  }
}

export async function saveProgram(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { programId } = req.body;

    if (!programId) {
      res.status(400).json({ error: 'programId é obrigatório' });
      return;
    }

    const savedProgram = await enrollmentService.saveProgram(req.userId, programId);

    res.status(201).json({
      message: 'Programa salvo com sucesso',
      savedProgram
    });
  } catch (error: any) {
    if (error.message === 'Programa já foi salvo') {
      res.status(409).json({
        error: 'Programa já foi salvo',
        code: 'ALREADY_SAVED'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao salvar programa',
      code: 'SAVE_PROGRAM_ERROR'
    });
  }
}

export async function unsaveProgram(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { savedProgramId } = req.params;

    // TODO: Verificar se o savedProgram pertence ao usuário

    await enrollmentService.unsaveProgram(req.userId, savedProgramId);

    res.status(200).json({
      message: 'Programa removido dos salvos com sucesso'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Programa salvo não encontrado',
        code: 'SAVED_PROGRAM_NOT_FOUND'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao remover programa',
      code: 'UNSAVE_PROGRAM_ERROR'
    });
  }
}

export async function getUserSavedPrograms(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const savedPrograms = await enrollmentService.getUserSavedPrograms(req.userId);

    res.status(200).json({
      message: 'Programas salvos obtidos com sucesso',
      savedPrograms,
      count: savedPrograms.length
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Erro ao obter programas salvos',
      code: 'GET_SAVED_PROGRAMS_ERROR'
    });
  }
}
