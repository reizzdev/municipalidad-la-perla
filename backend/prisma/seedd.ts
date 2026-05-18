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
      name: 'Oficina de Tecnología de la Información',
      abbreviation: 'OTI',
      color: '#1e3a8a', // azul marino
    },
    {
      username: 'ORRHH',
      password: 'orrhh2026',
      name: 'Oficina de Gestión',
      abbreviation: 'RRHH',
      color: '#6d28d9', // morado
    },
    {
      username: 'OLOGISTICA',
      password: 'ologistica2026',
      name: 'Oficina de Administración',
      abbreviation: 'LOGI',
      color: '#065f46', // verde oscuro
    },
    {
      username: 'OADMIN',
      password: 'oadmin2026',
      name: 'Oficina de Rentas',
      abbreviation: 'ADMIN',
      color: '#92400e', // marrón
    },
    {
      username: 'OGMUNICIPAL',
      password: 'ogmunicipal2026',
      name: 'Oficina de Rentas',
      abbreviation: 'MUNI',
      color: '#0e9275', // marrón
    },
    {
      username: 'OALCALDIA',
      password: 'oalcaldia2026',
      name: 'Oficina de Rentas',
      abbreviation: 'ALCA',
      color: '#920e0e', // marrón
    },
    {
      username: 'OGGADMIN',
      password: 'oggadmin2026',
      name: 'Oficina de Rentas',
      abbreviation: 'OADMIN',
      color: '#920e8c', // marrón
    },
    {
      username: 'OJURIDICA',
      password: 'ojuridica2026',
      name: 'Oficina de Rentas',
      abbreviation: 'JURI',
      color: '#0e9292', // marrón
    },
    {
      username: 'OSECRETARIA',
      password: 'osecretaria2026',
      name: 'Oficina de Rentas',
      abbreviation: 'SECRE',
      color: '#920e36', // marrón
    },
    {
      username: 'OIMAGEN',
      password: 'oimagen2026',
      name: 'Oficina de Rentas',
      abbreviation: 'IMG',
      color: '#92640e', // marrón
    },
    {
      username: 'OPLANEAMIENTO',
      password: 'oplaneamiento2026',
      name: 'Oficina de Rentas',
      abbreviation: 'PLAN',
      color: '#0e9236', // marrón
    },
    {
      username: 'OPROCURADURIA',
      password: 'oprocuraduria2026',
      name: 'Oficina de Rentas',
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
  
  const responsibles = [
    // OTI
    { name: 'María García', areaId: oti!.id },
    { name: 'Carlos Pérez', areaId: oti!.id },
    { name: 'Lucía Torres', areaId: oti!.id },
  ];

  for (const r of responsibles) {
    await prisma.responsible.create({ data: r });
  }
  console.log(`${responsibles.length} responsables creados`);

  // ----------------------------------------------------------
  // EQUIPOS
  // ----------------------------------------------------------
  const equipments = [
    { name: 'Laptop',     description: 'Laptop HP ' },
    { name: 'Proyector',  description: 'Proyector Epson' },
    { name: 'Adaptador',  description: 'Adaptador' },
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
    { name: 'MUNICIPALIDAD',   floor: 'Piso 2' },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    });
  }
  console.log(`${rooms.length} salas creadas`);

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
