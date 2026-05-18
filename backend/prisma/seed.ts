// ============================================================
// seed.ts — Datos iniciales para desarrollo
// Ejecutar: npx prisma db seed
// ============================================================

import { PrismaClient, ReservationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ----------------------------------------------------------
  // ÁREAS (usuarios del sistema)
  // ----------------------------------------------------------
  const areas = [
    {
      username: 'OTECNOLOGIA',
      password: 'otecnologia2026',
      name: 'Oficina Tecnologia de la Información',
      abbreviation: 'OTI',
      color: '#1e3a8a', // azul marino
    },
    {
      username: 'ORRHH',
      password: 'orrhh2026',
      name: 'Oficina de Recursos Humanos',
      abbreviation: 'RRHH',
      color: '#6d28d9', // morado
    },
    {
      username: 'OLOGISTICA',
      password: 'ologistica2026',
      name: 'Oficina de logistica',
      abbreviation: 'LOGI',
      color: '#065f46', // verde oscuro
    },
    {
      username: 'OADMIN',
      password: 'oadmin2026',
      name: 'Oficina de administracion',
      abbreviation: 'ADMIN',
      color: '#92400e', // marrón
    },
    {
      username: 'OGMUNICIPAL',
      password: 'ogmunicipal2026',
      name: 'Oficina municipal',
      abbreviation: 'MUNI',
      color: '#0e9275', // marrón
    },
    {
      username: 'OALCALDIA',
      password: 'oalcaldia2026',
      name: 'Oficina de alcaldia',
      abbreviation: 'ALCA',
      color: '#920e0e', // marrón
    },
    {
      username: 'OJURIDICA',
      password: 'ojuridica2026',
      name: 'Oficina juridica',
      abbreviation: 'JURI',
      color: '#0e9292', // marrón
    },
    {
      username: 'OSECRETARIA',
      password: 'osecretaria2026',
      name: 'Oficina de secretaria',
      abbreviation: 'SECRE',
      color: '#920e36', // marrón
    },
    {
      username: 'OIMAGEN',
      password: 'oimagen2026',
      name: 'Oficina de imagen',
      abbreviation: 'IMG',
      color: '#92640e', // marrón
    },
    {
      username: 'OPLANEAMIENTO',
      password: 'oplaneamiento2026',
      name: 'Oficina de imagen',
      abbreviation: 'PLAN',
      color: '#0e9236', // marrón
    },
    {
      username: 'OPROCURADURIA',
      password: 'oprocuraduria2026',
      name: 'Oficina de procuraduria',
      abbreviation: 'PROCU',
      color: '#0e3c92', // marrón
    },
  ];

  for (const area of areas) {
    const passwordHash = await bcrypt.hash(area.password, 10);
    await prisma.area.upsert({
      where: { username: area.username },
      update: {},
      create: {
        username: area.username,
        passwordHash,
        name: area.name,
        abbreviation: area.abbreviation,
        color: area.color,
      },
    });
    console.log(`Área creada: ${area.abbreviation} — ${area.name}`);
  }

  // ----------------------------------------------------------
  // RESPONSABLES por área
  // ----------------------------------------------------------
  const oti = await prisma.area.findUnique({ where: { username: 'OTECNOLOGIA' } });
  const rrhh = await prisma.area.findUnique({ where: { username: 'ORRHH' } });
  const logi = await prisma.area.findUnique({ where: { username: 'OLOGISTICA' } });
  const admin = await prisma.area.findUnique({ where: { username: 'OADMIN' } });
  const muni = await prisma.area.findUnique({ where: { username: 'OGMUNICIPAL' } });
  const alca = await prisma.area.findUnique({ where: { username: 'OALCALDIA' } });
  const juri = await prisma.area.findUnique({ where: { username: 'OJURIDICA' } });
  const secre = await prisma.area.findUnique({ where: { username: 'OSECRETARIA' } });
  const img = await prisma.area.findUnique({ where: { username: 'OIMAGEN' } });
  const plan = await prisma.area.findUnique({ where: { username: 'OPLANEAMIENTO' } });
  const procu = await prisma.area.findUnique({ where: { username: 'OPROCURADURIA' } });



  // ----------------------------------------------------------
  // EQUIPOS
  // ----------------------------------------------------------
  const equipments = [
    { name: 'PROYECTOR',     description: 'Proyector Epson' },
    { name: 'LAPTOP',  description: 'Laptop HP' },
    { name: 'HDMI',  description: 'cable hdmi' },
    { name: 'EXTENSION',  description: 'extension para equipos' },
  ];

  for (const eq of equipments) {
    await prisma.equipment.upsert({
      where: { name: eq.name },
      update: {},
      create: eq,
    });
  }
  console.log(`${equipments.length} equipos creados`);

  // ----------------------------------------------------------
  // SALAS
  // ----------------------------------------------------------
  const rooms = [
    { name: 'CIAM',   floor: 'Piso 1' },
    { name: 'PALACIO (muni)',   floor: 'Piso 1' },
    { name: 'MAESTRANZA',   floor: 'Piso 2' },
    { name: 'CAHUIDE',   floor: 'Piso 1' },
    { name: '2 DE MAYO',  floor: 'Piso 3' },
    { name: 'OVALO',    floor: 'Piso 4' },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    });
  }
  console.log(`${rooms.length} salas creadas`);




  // ----------------------------------------------------------
  // PERMISOS
  // ----------------------------------------------------------

const permissions = [
    'DASHBOARD_VIEW',
    'FOTOS_CRUD',
    'NOTICIAS_CRUD',
    'CONVOCATORIAS_CRUD',
    'CALENDARIO_CRUD',
    'INCIDENCIAS_CRUD',
  ];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ Permisos creados');








  console.log('\nSeed completado exitosamente.');
}


main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
