import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.users.deleteMany({});
});

describe('Login de usuário', () => {
  beforeEach(async () => {
    // Cria um usuário válido para login
    await prisma.users.create({
      data: {
        name_user: 'Login Teste',
        email_user: 'login@teste.com',
        pass_user: await require('bcrypt').hash('123456', 10),
        type_user: 'client',
      },
    });
  });

  it('deve logar com sucesso e retornar token e dados do usuário', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'login@teste.com',
        pass: '123456',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toMatchObject({
      name: 'Login Teste',
      email: 'login@teste.com',
      role: 'client',
    });
  });

  it('deve retornar sucesso false e mensagem se dados inválidos', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'login@teste.com',
        pass: 'senhaerrada',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Dados invalidos');
  });

  it('deve retornar sucesso false e mensagem se usuário não existe', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'naoexiste@teste.com',
        pass: 'qualquer',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Dados invalidos');
  });
});
