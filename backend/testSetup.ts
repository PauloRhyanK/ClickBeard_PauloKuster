import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function globalSetup() {
  
  await prisma.appointments.deleteMany({});
  await prisma.barber_Specialities.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.specialties.deleteMany({});

  await prisma.users.createMany({
    data: [
      {
        name_user: 'Admin',
        email_user: 'admin@teste.com',
        pass_user: '$2b$10$123456789012345678901uQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        type_user: 'admin',
      },
      {
        name_user: 'Barber',
        email_user: 'barber@teste.com',
        pass_user: '$2b$10$123456789012345678901uQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        type_user: 'barber',
      },
      {
        name_user: 'Client',
        email_user: 'client@teste.com',
        pass_user: '$2b$10$123456789012345678901uQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        type_user: 'client',
      }
    ]
  });

  await prisma.specialties.create({
    data: {
      id_speciality: 1,
      nm_speciality: 'Corte',
    }
  });
  await prisma.specialties.create({
    data: {
      id_speciality: 2,
      nm_speciality: 'Barba',
    }
  });
  await prisma.specialties.create({
    data: {
      id_speciality: 3,
      nm_speciality: 'Sombrancelha',
    }
  });

  const barber = await prisma.users.findUnique({ where: { email_user: 'barber@teste.com' } });
  if (!barber) {
    throw new Error("Barber user not found");
  }
  await prisma.barber_Specialities.create({
    data: {
      id_user: barber.id_user,
      id_speciality: 1
    }
  });

  await prisma.$disconnect();
}
