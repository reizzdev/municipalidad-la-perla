select * from areas;
select * from responsibles;
select * from rooms;
select * from equipments;

INSERT INTO areas (
  id,
  username,
  "passwordHash",
  name,
  abbreviation,
  color,
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'OTECNOLOGIA',
  '$2b$10$hRiv7jB1W.cPpIfbAZQyFOwVlvyNI42kt3SM3WyR5QWuLvyz5M5u6',
  'Oficina de Tecnología de la Información',
  'OTI',
  '#1e3a8a',
  true,
  NOW(),
  NOW()
);




INSERT INTO responsibles (id, name, "areaId", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Carlos Pérez', (SELECT id FROM areas WHERE username='OTECNOLOGIA'), NOW(), NOW());


INSERT INTO responsibles (id, name, "areaId", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Keiko CSM', (SELECT id FROM areas WHERE username='ORRHH'), NOW(), NOW());

INSERT INTO equipments (id, name, description, "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Laptop', 'Laptop HP', NOW(), NOW()),
(gen_random_uuid(), 'Proyector', 'Proyector Epson', NOW(), NOW()),
(gen_random_uuid(), 'Adaptador', 'Adaptador', NOW(), NOW());

INSERT INTO rooms (id, name, floor, "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'CIAM', 'Piso 1', NOW(), NOW()),
(gen_random_uuid(), 'MUNICIPALIDAD LA PERLA', 'Piso 2', NOW(), NOW());
