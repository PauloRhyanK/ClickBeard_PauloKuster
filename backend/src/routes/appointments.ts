import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /appointments
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { date, hour, email_barber, email_client, speciality } = req.body;
    const userRole = req.user?.role;
    console.log('User role:', userRole);
    if (!date || !hour || !email_barber || !email_client || !speciality) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes' });
    }

    const appointmentDate = new Date(`${date}T${hour}:00.000Z`);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ success: false, message: 'Data retroativa não permitida' });
    }

    const barber = await prisma.users.findUnique({ where: { email_user: email_barber, type_user: 'barber' } });
    if (!barber) {
      return res.status(400).json({ success: false, message: 'Barbeiro não encontrado' });
    }

    const client = await prisma.users.findUnique({ where: { email_user: email_client, type_user: 'client' } });
    if (!client) {
      return res.status(400).json({ success: false, message: 'Cliente não encontrado' });
    }

    const spec = await prisma.specialties.findFirst({ where: { nm_speciality: speciality } });
    if (!spec) {
      return res.status(400).json({ success: false, message: 'Especialidade não encontrada' });
    }

    const hasSpec = await prisma.barber_Specialities.findFirst({ where: { id_user: barber.id_user, id_speciality: spec.id_speciality } });
    if (!hasSpec) {
      return res.status(400).json({ success: false, message: 'Barbeiro não possui essa especialidade' });
    }
    
    const exists = await prisma.appointments.findFirst({
      where: {
        id_barber: barber.id_user,
        appointment_time: appointmentDate,
        canceled_at: null
      }
    });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Horário já ocupado para este barbeiro' });
    }

    
    await prisma.appointments.create({
      data: {
        id_client: client.id_user,
        id_barber: barber.id_user,
        id_speciality: spec.id_speciality,
        appointment_time: appointmentDate
      }
    });
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erro ao criar agendamento', details: err instanceof Error ? err.message : err });
  }
});

export default router;
