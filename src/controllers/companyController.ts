import { z } from 'zod';
import type { Request, Response } from 'express';
import * as companyService from '../services/companyService.ts';

const RegisterCompanySchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    website: z.string().url('Website inválido').optional().nullable(),
    cpnj: z.string().min(11, 'CNPJ inválido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Senhas não conferem'
  });

const LoginCompanySchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export async function registerCompanyHandler(req: Request, res: Response) {
  try {
    const { name, email, website, cpnj, password } = RegisterCompanySchema.parse(req.body);
    const result = await companyService.registerCompany(name, email, website ?? null, cpnj, password);
    res.status(201).json({ message: 'Empresa cadastrada com sucesso', company: result.company, token: result.token });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
    res.status(400).json({ error: err.message || 'Erro no cadastro' });
  }
}

export async function loginCompanyHandler(req: Request, res: Response) {
  try {
    const { email, password } = LoginCompanySchema.parse(req.body);
    const result = await companyService.loginCompany(email, password);
    res.status(200).json({ message: 'Login realizado com sucesso', company: result.company, token: result.token });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Email ou senha incorretos' });
  }
}