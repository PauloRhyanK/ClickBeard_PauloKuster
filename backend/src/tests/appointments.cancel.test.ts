import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('POST /appointments/cancel', () => {
  let clientToken: string;
  let adminToken: string;
  let barberToken: string;
  let testDate = '2025-07-24';
  let testHour = '11:00';

  beforeAll(async () => {
    const client = await prisma.users.findFirst({ where: { email_user: 'client@teste.com', type_user: 'client' } });
    const barber = await prisma.users.findFirst({ where: { email_user: 'barber@teste.com', type_user: 'barber' } });
    const admin = await prisma.users.findFirst({ where: { email_user: 'admin@teste.com', type_user: 'admin' } });
    const JWT_SECRET = process.env.JWT_SECRET || 'NotSet';
    if (!client) throw new Error('Client not found');
    if (!barber) throw new Error('Barber not found');
    if (!admin) throw new Error('Admin not found');
    clientToken = jwt.sign({ id: client.id_user.toString(), role: 'client' }, JWT_SECRET);
    barberToken = jwt.sign({ id: barber.id_user.toString(), role: 'barber' }, JWT_SECRET);
    adminToken = jwt.sign({ id: admin.id_user.toString(), role: 'admin' }, JWT_SECRET);

    // Cria agendamento para cancelar
    const spec = await prisma.specialties.findFirst({});
    await prisma.appointments.create({
      data: {
        id_client: client.id_user,
        id_barber: barber.id_user,
        id_speciality: spec?.id_speciality || 1,
        appointment_time: new Date(`${testDate}T${testHour}:00.000Z`),
        canceled_at: null
      }
    });
  });

  it('cliente pode cancelar seu próprio agendamento', async () => {
    const res = await request(app)
      .post('/appointments/cancel')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: testDate,
        hour: testHour,
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('admin pode cancelar agendamento de qualquer cliente', async () => {
    // Recria agendamento para admin cancelar
    const client = await prisma.users.findFirst({ where: { email_user: 'client@teste.com', type_user: 'client' } });
    const barber = await prisma.users.findFirst({ where: { email_user: 'barber@teste.com', type_user: 'barber' } });
    const spec = await prisma.specialties.findFirst({});
    await prisma.appointments.create({
      data: {
        id_client: client!.id_user,
        id_barber: barber!.id_user,
        id_speciality: spec?.id_speciality || 1,
        appointment_time: new Date(`${testDate}T12:00:00.000Z`),
        canceled_at: null
      }
    });
    const res = await request(app)
      .post('/appointments/cancel')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        date: testDate,
        hour: '12:00',
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('barber não pode cancelar agendamento de cliente', async () => {
    // Recria agendamento para testar
    const client = await prisma.users.findFirst({ where: { email_user: 'client@teste.com', type_user: 'client' } });
    const barber = await prisma.users.findFirst({ where: { email_user: 'barber@teste.com', type_user: 'barber' } });
    const spec = await prisma.specialties.findFirst({});
    await prisma.appointments.create({
      data: {
        id_client: client!.id_user,
        id_barber: barber!.id_user,
        id_speciality: spec?.id_speciality || 1,
        appointment_time: new Date(`${testDate}T13:00:00.000Z`),
        canceled_at: null
      }
    });
    const res = await request(app)
      .post('/appointments/cancel')
      .set('Authorization', `Bearer ${barberToken}`)
      .send({
        date: testDate,
        hour: '13:00',
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com'
      });
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/apenas o cliente|admin/i);
  });

  it('não pode cancelar agendamento inexistente', async () => {
    const res = await request(app)
      .post('/appointments/cancel')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: testDate,
        hour: '14:00',
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com'
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/não encontrado|cancelado/i);
  });
});
