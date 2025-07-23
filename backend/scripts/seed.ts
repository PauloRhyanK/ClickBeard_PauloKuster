import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpa tudo
  await prisma.appointments.deleteMany({});
  await prisma.barber_Specialities.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.specialties.deleteMany({});

  // Cria especialidades
  const especialidades = await prisma.specialties.createMany({
    data: [
      { id_speciality: 1, nm_speciality: 'Corte' },
      { id_speciality: 2, nm_speciality: 'Barba' },
      { id_speciality: 3, nm_speciality: 'Sombrancelha' },
      { id_speciality: 4, nm_speciality: 'Coloração' },
      { id_speciality: 5, nm_speciality: 'Desenho' },
    ]
  });

  // Cria barbeiros
  for (let i = 1; i <= 5; i++) {
    const barber = await prisma.users.create({
      data: {
        name_user: `Barber ${i}`,
        email_user: `barber${i}@teste.com`,
        pass_user: await bcrypt.hash('123456', 10),
        type_user: 'barber',
        age_user: 25 + i,
        hiring_date: new Date(`2022-01-0${i}T10:00:00.000Z`)
      }
    });
    // Cada barbeiro recebe 2 especialidades
    await prisma.barber_Specialities.create({ data: { id_user: barber.id_user, id_speciality: i } });
    await prisma.barber_Specialities.create({ data: { id_user: barber.id_user, id_speciality: ((i % 5) + 1) } });
  }

  // Cria clientes
  for (let i = 1; i <= 10; i++) {
    await prisma.users.create({
      data: {
        name_user: `Cliente ${i}`,
        email_user: `cliente${i}@teste.com`,
        pass_user: await bcrypt.hash('123456', 10),
        type_user: 'client',
        age_user: 18 + i
      }
    });
  }

  // Cria agendamentos aleatórios
  const barbers = await prisma.users.findMany({ where: { type_user: 'barber' } });
  const clients = await prisma.users.findMany({ where: { type_user: 'client' } });
  for (let i = 0; i < 20; i++) {
    const barber = barbers[Math.floor(Math.random() * barbers.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const speciality = 1 + (i % 5);
    const day = 23 + (i % 5);
    const hour = 9 + (i % 8);
    await prisma.appointments.create({
      data: {
        id_client: client.id_user,
        id_barber: barber.id_user,
        id_speciality: speciality,
        appointment_time: new Date(`2025-07-${day}T${hour.toString().padStart(2, '0')}:00:00.000Z`)
      }
    });
  }

  console.log('Banco populado com sucesso!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
