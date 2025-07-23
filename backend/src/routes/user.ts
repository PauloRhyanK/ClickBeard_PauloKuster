import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /register
router.post('/register', async (req, res) => {
  const { name_user, email_user, pass_user, type_user, age_user, hiring_date } = req.body;

  // Validação básica
  if (!name_user || !email_user || !pass_user || !type_user) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
  }
  if (type_user !== 'barber' && type_user !== 'client') {
    return res.status(400).json({ error: 'Tipo de usuário inválido' });
  }

  // Verifica se o email já existe
  const existingUser = await prisma.users.findUnique({ where: { email_user: email_user } });
  if (existingUser) {
    return res.status(400).json({ error: 'E-mail já cadastrado' });
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(pass_user, 10);

  // Cria o usuário
  const user = await prisma.users.create({
    data: {
      name_user,
      email_user,
      pass_user: hashedPassword,
      type_user,
      age_user,
      hiring_date,
    },
  });

  return res.status(201).json({ success: true });
});

export default router;
