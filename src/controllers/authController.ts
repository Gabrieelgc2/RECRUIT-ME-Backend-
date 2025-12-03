import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as authService from '../services/authService';
import { z } from 'zod';

const SignupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres')
});

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export async function signup(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, email, password } = SignupSchema.parse(req.body);

    const result = await authService.registerUser(name, email, password);

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    if (error.message === 'Email já cadastrado') {
      res.status(409).json({
        error: 'Email já cadastrado',
        code: 'EMAIL_EXISTS'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao cadastrar usuário',
      code: 'SIGNUP_ERROR'
    });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Login realizado com sucesso',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    if (error.message === 'Usuário não encontrado' || error.message === 'Senha incorreta') {
      res.status(401).json({
        error: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    res.status(500).json({
      error: error.message || 'Erro ao fazer login',
      code: 'LOGIN_ERROR'
    });
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const user = await authService.getUserProfile(req.userId);

    res.status(200).json({
      message: 'Perfil obtido com sucesso',
      user
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Erro ao obter perfil',
      code: 'PROFILE_ERROR'
    });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { name, phone, bio, avatar } = req.body;

    const user = await authService.updateUserProfile(req.userId, {
      name,
      phone,
      bio,
      avatar
    });

    res.status(200).json({
      message: 'Perfil atualizado com sucesso',
      user
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Erro ao atualizar perfil',
      code: 'UPDATE_ERROR'
    });
  }
}
