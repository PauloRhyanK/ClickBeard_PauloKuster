import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function globalTeardown() {
  await prisma.appointments.deleteMany({});
  await prisma.barber_Specialities.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.specialties.deleteMany({});
  await prisma.$disconnect();
}
