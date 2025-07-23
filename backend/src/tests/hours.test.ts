import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('GET /hours', () => {
  let token: string;

  beforeAll(() => {
    token = jwt.sign({ id: '1', role: 'client', email: 'test@exemplo.com', name: 'Test User' }, process.env.JWT_SECRET || 'NotSet');
  });

  it('deve retornar 401 se não enviar token', async () => {
    const res = await request(app)
      .get('/hours')
      .query({ date: '2025-07-22' });
    expect(res.status).toBe(401);
  });

  it('deve retornar 400 se não enviar data', async () => {
    const res = await request(app)
      .get('/hours')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('deve retornar sucesso e arrays de horários e barbeiros', async () => {
    const res = await request(app)
      .get('/hours')
      .set('Authorization', `Bearer ${token}`)
      .query({ date: '2025-07-22' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.hours)).toBe(true);
    expect(Array.isArray(res.body.barbers)).toBe(true);
  });
});
