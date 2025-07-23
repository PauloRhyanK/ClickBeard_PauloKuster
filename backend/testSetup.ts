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

  await prisma.$disconnect();
}
