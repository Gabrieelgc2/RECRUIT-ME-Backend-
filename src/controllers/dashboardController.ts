import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.ts';
import { prisma } from '../config/prisma.ts';

export async function userDashboard(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        role: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao obter dashboard do usuário' });
  }
}

export async function companyDashboard(req: AuthRequest, res: Response) {
  try {
    const companyId = req.userId;
    if (!companyId) return res.status(401).json({ error: 'Empresa não autenticada' });

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        cnpj: true,
        // adicione outros campos públicos que desejar
      }
    });

    if (!company) return res.status(404).json({ error: 'Empresa não encontrada' });

    return res.json({ company });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao obter dashboard da empresa' });
  }
}