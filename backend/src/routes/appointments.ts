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

// POST /appointments/cancel
router.post('/cancel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { date, hour, email_barber, email_client } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;
    if (!date || !hour || !email_barber || !email_client) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes' });
    }

    const appointmentDate = new Date(`${date}T${hour}:00.000Z`);
    const barber = await prisma.users.findUnique({ where: { email_user: email_barber, type_user: 'barber' } });
    if (!barber) {
      return res.status(400).json({ success: false, message: 'Barbeiro não encontrado' });
    }
    const client = await prisma.users.findUnique({ where: { email_user: email_client, type_user: 'client' } });
    if (!client) {
      return res.status(400).json({ success: false, message: 'Cliente não encontrado' });
    }

    const appointment = await prisma.appointments.findFirst({
      where: {
        id_barber: barber.id_user,
        id_client: client.id_user,
        appointment_time: appointmentDate,
        canceled_at: null
      }
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Agendamento não encontrado ou já cancelado' });
    }

    // Só o cliente do appointment ou admin pode cancelar
    if (!(userRole === 'admin' || (userRole === 'client' && userId && BigInt(userId) === appointment.id_client))) {
      return res.status(403).json({ success: false, message: 'Apenas o cliente do agendamento ou admin pode cancelar' });
    }

    await prisma.appointments.update({
      where: { id_appointments: appointment.id_appointments },
      data: { canceled_at: new Date() }
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erro ao cancelar agendamento', details: err instanceof Error ? err.message : err });
  }
});

// GET /appointments/list
router.get('/list', authenticateToken, async (req: AuthRequest, res) => {
  const { date, email_user } = req.query;
  const userRole = req.user?.role;
  const userId = req.user?.id;
  let appointments = [];

  try {
    if (userRole === 'client') {
      if (userId === undefined) {
        console.log('User ID not found in request');  
        return res.status(400).json({ success: false, message: 'ID do usuário não encontrado' });
      }
      const client = await prisma.users.findFirst({ where: { id_user: BigInt(userId), type_user: 'client' } });
      if (!client) return res.status(200).json({ success: true, message: 'Sem dados' });
      appointments = await prisma.appointments.findMany({
        where: { id_client: client.id_user },
        orderBy: { appointment_time: 'desc' },
        take: 50,
        include: {
          barber: { select: { name_user: true, email_user: true } },
          speciality: { select: { nm_speciality: true } },
          client: { select: { name_user: true, email_user: true } }
        }
      });
    } else if (userRole === 'barber') {
      if (!date) return res.status(400).json({ success: false, message: 'Data obrigatória' });
      if (userId === undefined) return res.status(400).json({ success: false, message: 'ID do usuário não encontrado' });
      const barber = await prisma.users.findFirst({ where: { id_user: BigInt(userId), type_user: 'barber' } });
      if (!barber) return res.status(200).json({ success: false, message: 'Sem dados' });
      appointments = await prisma.appointments.findMany({
        where: {
          id_barber: barber.id_user,
          appointment_time: {
            gte: new Date(date + 'T00:00:00.000Z'),
            lt: new Date(date + 'T23:59:59.999Z')
          }
        },
        include: {
          barber: { select: { name_user: true, email_user: true } },
          speciality: { select: { nm_speciality: true } },
          client: { select: { name_user: true, email_user: true } }
        }
      });
    } else if (userRole === 'admin') {

      if (!date) return res.status(400).json({ success: false, message: 'Data obrigatória' });
      let where: any = {
        appointment_time: {
          gte: new Date(date + 'T00:00:00.000Z'),
          lt: new Date(date + 'T23:59:59.999Z')
        }
      };
      if (email_user) {
  
        const user = await prisma.users.findFirst({ where: { email_user: String(email_user) } });
        if (user) {
          if (user.type_user === 'client') where.id_client = user.id_user;
          if (user.type_user === 'barber') where.id_barber = user.id_user;
        }
      }
      appointments = await prisma.appointments.findMany({
        where,
        include: {
          barber: { select: { name_user: true, email_user: true } },
          speciality: { select: { nm_speciality: true } },
          client: { select: { name_user: true, email_user: true } }
        }
      });
    } else {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }

    if (!appointments.length) {
      return res.status(200).json({ success: false, message: 'Sem dados' });
    }

    const result = appointments.map((app: { appointment_time: { toISOString: () => string; }; barber: { name_user: any; email_user: any; }; speciality: { nm_speciality: any; }; client: { name_user: any; email_user: any; }; }) => ({
      date: app.appointment_time.toISOString().substring(0, 10),
      hour: app.appointment_time.toISOString().substring(11, 16),
      barber: { name: app.barber.name_user, email: app.barber.email_user },
      speciality: [app.speciality.nm_speciality],
      client: { name: app.client.name_user, email: app.client.email_user }
    }));
    return res.status(200).json({ success: true, appointments: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos', details: err instanceof Error ? err.message : err });
  }
});

export default router;

