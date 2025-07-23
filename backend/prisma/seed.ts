import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const especialidades = [
        { id_speciality: 1, nm_speciality: 'Cabelo' },
        { id_speciality: 2, nm_speciality: 'Barba' },
        { id_speciality: 3, nm_speciality: 'Sobrancelha' },
        { id_speciality: 4, nm_speciality: 'Implante' },
        { id_speciality: 5, nm_speciality: 'Hidratação' }
    ];

    for (const esp of especialidades) {
        await prisma.specialties.upsert({
            where: { id_speciality: esp.id_speciality },
            update: {},
            create: esp,
        });
    }

    const adminEmail = 'admin@clickbeard.com';
    const adminSenhaHash = '$2b$10$FQopcuPnGh2eKD8.lH769.n3um2piIefNHkaXy304UhD/mgikwGge'; 
    await prisma.users.upsert({
        where: { email_user: adminEmail },
        update: {},
        create: {
            name_user: 'Administrador',
            email_user: adminEmail,
            pass_user: adminSenhaHash,
            type_user: 'admin',
            age_user: 30,
            hiring_date: new Date().toISOString(),
        },
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });