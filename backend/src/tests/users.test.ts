import app from '../app';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
const prisma = new PrismaClient();



// Limpa apenas usuários criados para os testes
const testEmails = [
  'joao@teste.com',
  'faltando@teste.com',
  'tipo@teste.com',
  'duplicado@teste.com'
];

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Cadastro de usuário', () => {
  it.skip('Deve cadastrar um novo usuário com sucesso', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name_user: 'João Teste',
        email_user: 'joao@teste.com',
        pass_user: '123456',
        type_user: 'client'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it.skip('deve retornar 400 se faltar parâmetros obrigatórios', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        email_user: 'faltando@teste.com',
        pass_user: '123456',
        type_user: 'client'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it.skip('deve retornar 400 se o tipo de usuário for inválido', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name_user: 'Teste',
        email_user: 'tipo@teste.com',
        pass_user: '123456',
        type_user: 'admin'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it.skip('deve retornar 400 se o email já estiver cadastrado', async () => {
    // Primeiro cadastro
    await request(app)
      .post('/users/register')
      .send({
        name_user: 'Duplicado',
        email_user: 'duplicado@teste.com',
        pass_user: '123456',
        type_user: 'client'
      });
    // Segundo cadastro com mesmo email
    const res = await request(app)
      .post('/users/register')
      .send({
        name_user: 'Duplicado2',
        email_user: 'duplicado@teste.com',
        pass_user: '123456',
        type_user: 'client'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
