import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const DEFAULT_HOURS: string[] = [];
for (let h = 8; h <= 18; h++) {
    for (let m of [0, 30]) {
        if (h === 18 && m > 0) continue;
        const hour = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
        DEFAULT_HOURS.push(hour);
    }
}

// GET /hours
router.get('/', authenticateToken, async (req, res) => {
  const date = req.query.date as string;
  if (!date) {
    return res.status(400).json({ success: false, message: 'Data obrigatória' });
  }

  const barbers = await prisma.users.findMany({
    where: { type_user: 'barber' },
    select: {
      id_user: true,
      name_user: true,
      email_user: true,
      barber_specialities: {
        select: {
          speciality: { select: { nm_speciality: true } }
        }
      },
      appointments_barber: {
        where: {
          appointment_time: {
            gte: new Date(date + 'T00:00:00.000Z'),
            lt: new Date(date + 'T23:59:59.999Z')
          },
          canceled_at: null
        },
        select: { appointment_time: true }
      }
    }
  });

  const hours = DEFAULT_HOURS.map(hour => {
    const selected = barbers.every(barber =>
      barber.appointments_barber.some(app => {
        const appHour = app.appointment_time.toISOString().substring(11, 16);
        return appHour === hour;
      })
    );
    return { hour, selected };
  });

  const barbersArr = barbers.map(barber => ({
    name: barber.name_user,
    email: barber.email_user,
    specialities: barber.barber_specialities.map(bs => bs.speciality.nm_speciality),
    appointments: barber.appointments_barber.map(app => app.appointment_time.toISOString().substring(11, 16))
  }));
  return res.status(200).json({ success: true, hours, barbers: barbersArr });
});

export default router;
