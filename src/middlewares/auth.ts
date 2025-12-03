import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.ts';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Token não fornecido',
        code: 'NO_TOKEN' 
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ 
        error: 'Token inválido ou expirado',
        code: 'INVALID_TOKEN' 
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Erro ao validar token',
      code: 'TOKEN_ERROR' 
    });
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  if (err.code === 'P2002') {
    res.status(409).json({ 
      error: 'Email já cadastrado',
      code: 'EMAIL_EXISTS' 
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({ 
      error: 'Registro não encontrado',
      code: 'NOT_FOUND' 
    });
    return;
  }

  res.status(500).json({ 
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR' 
  });
}
