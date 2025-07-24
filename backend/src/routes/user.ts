import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { authorizeAdminOrBarber } from '../middleware/authorizeAdminOrBarber';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

// POST /users/login
router.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res.status(400).json({ success: false, message: 'Dados invalidos' });
    }
    const user = await prisma.users.findUnique({ where: { email_user: email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Dados invalidos' });
    }
    const valid = await bcrypt.compare(pass, user.pass_user);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Dados invalidos' });
    }
    const JWT_SECRET = process.env.JWT_SECRET || "NotSet";
    const token = jwt.sign(
      {
        id: user.id_user.toString(),
        role: user.type_user,
        email: user.email_user,
        name: user.name_user,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        name: user.name_user,
        email: user.email_user,
        role: user.type_user,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ success: false, message: 'Erro interno', error: err instanceof Error ? err.message : err });
  }
});

// POST /users/register
router.post('/register', async (req, res) => {
  const { name_user, email_user, pass_user, type_user, age_user, appointments } = req.body;

  if (!name_user || !email_user || !pass_user || !type_user) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
  }
  if (type_user !== 'barber' && type_user !== 'client') {
    return res.status(400).json({ error: 'Tipo de usuário inválido' });
  }

  const existingUser = await prisma.users.findUnique({ where: { email_user: email_user } });
  if (existingUser) {
    return res.status(400).json({ error: 'E-mail já cadastrado' });
  }
  const date = new Date();
  const hashedPassword = await bcrypt.hash(pass_user, 10);
  const user = await prisma.users.create({
    data: {
      name_user,
      email_user,
      pass_user: hashedPassword,
      type_user,
      age_user,
      hiring_date: type_user === 'barber' ? date : null,
    },
  });

  if (type_user === 'barber' && Array.isArray(appointments) && appointments.length > 0) {
    const especialidades = await prisma.specialties.findMany({
      where: { nm_speciality: { in: appointments } },
      select: { id_speciality: true }
    });

    await prisma.barber_Specialities.createMany({
      data: especialidades.map((e: { id_speciality: bigint; }) => ({
        id_user: user.id_user,
        id_speciality: Number(e.id_speciality)
      })),
      skipDuplicates: true
    });
  }

  return res.status(201).json({ success: true });
});

// GET /users/clients
router.get('/clients', authenticateToken, authorizeAdminOrBarber, async (req: AuthRequest, res) => {
 try {
  const clients = await prisma.users.findMany({
    where: { type_user: 'client' },
    select: {
      id_user: true,
      name_user: true,
      email_user: true,
      age_user: true,
      created_at: true,
    },
  });
  const clientsSerialized = clients.map((c: { id_user: { toString: () => any; }; }) => ({
    ...c,
    id_user: c.id_user.toString(),
  }));
  return res.status(200).json(clientsSerialized);
} catch (err) {
    console.error('Erro ao buscar clientes:', err);
  return res.status(500).json({ error: 'Erro ao buscar clientes', details: err instanceof Error ? err.message : err });
}
});

export default router;
