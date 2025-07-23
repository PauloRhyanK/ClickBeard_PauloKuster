import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('POST /appointments', () => {
  let clientToken: string;
  let barberToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Busca usuários já criados pelo testSetup
    const client = await prisma.users.findUnique({ where: { email_user: 'client@teste.com' } });
    const barber = await prisma.users.findUnique({ where: { email_user: 'barber@teste.com' } });
    const admin = await prisma.users.findUnique({ where: { email_user: 'admin@teste.com' } });
    if (!client) throw new Error('Client not found');
    if (!barber) throw new Error('Barber not found');
    if (!admin) throw new Error('Admin not found');
    const JWT_SECRET = process.env.JWT_SECRET || 'NotSet';
    clientToken = jwt.sign({ id: client.id_user.toString(), role: 'client' }, JWT_SECRET);
    barberToken = jwt.sign({ id: barber.id_user.toString(), role: 'barber' }, JWT_SECRET);
    adminToken = jwt.sign({ id: admin.id_user.toString(), role: 'admin' }, JWT_SECRET);
  });

  it('deve criar agendamento com sucesso', async () => {
    const res = await request(app)
      .post('/appointment')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: '2025-07-23',
        hour: '10:00',
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com',
        speciality: 'Corte'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('deve recusar se data for retroativa', async () => {
    const res = await request(app)
      .post('/appointment')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: '2020-01-01',
        hour: '10:00',
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com',
        speciality: 'Corte'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/retroativa/i);
  });

  it('deve recusar se horário já estiver ocupado', async () => {
    const client = await prisma.users.findUnique({ where: { email_user: 'client@teste.com' } });
    if (!client) throw new Error('Client not found');
    const barber = await prisma.users.findUnique({ where: { email_user: 'barber@teste.com' } });
    if (!barber) throw new Error('Barber not found');
    await prisma.appointments.create({
      data: {
        id_client: client.id_user,
        id_barber: barber.id_user,
        id_speciality: 1,
        appointment_time: new Date('2025-07-23T10:00:00.000Z'),
      }
    });
    const res = await request(app)
      .post('/appointment')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: '2025-07-23',
        hour: '10:00',
        email_barber: 'barber@teste.com',
        email_client: 'client@teste.com',
        speciality: 'Corte'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/ocupado|livre/i);
  });

  it('deve recusar se barbeiro não existir', async () => {
    const res = await request(app)
      .post('/appointment')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: '2025-07-23',
        hour: '11:00',
        email_barber: 'naoexiste@teste.com',
        email_client: 'client@teste.com',
        speciality: 'Corte'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/barbeiro/i);
  });

  it('deve recusar se cliente não existir', async () => {
    const res = await request(app)
      .post('/appointment')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: '2025-07-23',
        hour: '11:00',
        email_barber: 'barber@teste.com',
        email_client: 'naoexiste@teste.com',
        speciality: 'Corte'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/cliente/i);
  });

  afterAll(async () => {
    await prisma.appointments.deleteMany({});
    await prisma.$disconnect();
  });
});
