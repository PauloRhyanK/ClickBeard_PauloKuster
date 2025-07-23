import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

let adminToken: string;
let barberToken: string;
let clientToken: string;


const testEmails = [
  'admin@teste.com',
  'barber@teste.com',
  'client@teste.com'
];

beforeEach(async () => {

  const JWT_SECRET = process.env.JWT_SECRET || 'NotSet';
  adminToken = jwt.sign({ id: 'admin-id', role: 'admin' }, JWT_SECRET);
  barberToken = jwt.sign({ id: 'barber-id', role: 'barber' }, JWT_SECRET);
  clientToken = jwt.sign({ id: 'client-id', role: 'client' }, JWT_SECRET);
});


describe('GET /users/clients', () => {
  it('permite acesso para admin e retorna clientes', async () => {
    const res = await request(app)
      .get('/users/clients')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u: { email_user: string }) => u.email_user === 'client@teste.com')).toBe(true);
  });

  it('permite acesso para barber e retorna clientes', async () => {
    const res = await request(app)
      .get('/users/clients')
      .set('Authorization', `Bearer ${barberToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u: { email_user: string }) => u.email_user === 'client@teste.com')).toBe(true);
  });

  it('nega acesso para client', async () => {
    const res = await request(app)
      .get('/users/clients')
      .set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Acesso negado');
  });

  it('nega acesso sem token', async () => {
    const res = await request(app)
      .get('/users/clients');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Erro: Token Inválido');
  });
});
