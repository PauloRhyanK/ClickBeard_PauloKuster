import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id?: string; role?: string; email?: string; name?: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'NotSet';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Erro: Token Inválido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Erro: Token Inválido' });
    }
    console.log('Payload JWT decodificado:', decoded);
    req.user = decoded;
    next();
  });
}
