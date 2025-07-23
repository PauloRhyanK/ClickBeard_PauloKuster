
import { Request, Response, NextFunction } from 'express';

// Extensão de tipo para garantir acesso ao req.user
interface AuthRequest extends Request {
  user?: { role?: string };
}

export function authorizeAdminOrBarber(req: AuthRequest, res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (role === 'admin' || role === 'barber') {
    return next();
  }
  return res.status(403).json({ error: 'Acesso negado' });
}