import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('GET /appointments/list', () => {
  let clientToken: string;
  let barberToken: string;
  let adminToken: string;

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
  });

  it('cliente deve listar seus próprios agendamentos', async () => {
    const res = await request(app)
      .get('/appointments/list')
      .set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.appointments)).toBe(true);
    expect(res.body.appointments[0]).toHaveProperty('barber');
    expect(res.body.appointments[0]).toHaveProperty('client');
  });

  it('barber deve listar seus agendamentos do dia', async () => {
    const res = await request(app)
      .get('/appointments/list')
      .set('Authorization', `Bearer ${barberToken}`)
      .query({ date: '2025-07-23' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.appointments)).toBe(true);
    expect(res.body.appointments[0]).toHaveProperty('barber');
    expect(res.body.appointments[0]).toHaveProperty('client');
  });

  it('admin deve listar todos agendamentos do dia', async () => {
    const res = await request(app)
      .get('/appointments/list')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ date: '2025-07-23' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.appointments)).toBe(true);
  });

  it('admin pode filtrar por email_user', async () => {
    const res = await request(app)
      .get('/appointments/list')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ date: '2025-07-23', email_user: 'client@teste.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.appointments)).toBe(true);
    expect(res.body.appointments.every((a: any) => a.client.email === 'client@teste.com')).toBe(true);
  });

  it('deve retornar mensagem se não houver dados', async () => {
    const res = await request(app)
      .get('/appointments/list')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ date: '2099-01-01' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/sem dados/i);
  });
});
