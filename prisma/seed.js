// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed Members dari data original
  const members = [
    { name: 'Helmy',   role: 'RAJA',                    instagram: 'helmresing69',   photo: '/uploads/helmi.jpg',  order: 1 },
    { name: 'Alya',    role: 'RATU',                    instagram: 'alyadayou',      photo: '/uploads/alya.jpg',   order: 2 },
    { name: 'Iqbal',   role: 'Arsiparis Sihir',         instagram: 'balzzz07_',      photo: '/uploads/iqbal.jpg',  order: 3 },
    { name: 'Khansa',  role: 'Penjaga Taman & Satwa',   instagram: 'licht.enchaa',   photo: '/uploads/aca2.jpeg',  order: 4 },
    { name: 'Putra',   role: 'Ahli Strategi Kerajaan',  instagram: 'putrahsyd',      photo: '/uploads/putra.jpg',  order: 5 },
    { name: 'Clayirin',role: 'Seniman Kerajaan',        instagram: 'k0kofish._',     photo: '/uploads/arin.jpg',   order: 6 },
    { name: 'Yossha',  role: 'Pang 5 Tempur',           instagram: null,             photo: '/uploads/yosa.jpg',   order: 7 },
  ];

  for (const member of members) {
    await prisma.member.upsert({
      where: { id: members.indexOf(member) + 1 },
      update: {},
      create: member,
    });
  }

  // Seed Gallery
  const galleries = [
    { imageUrl: '/uploads/iqbal2.jpeg', caption: 'Iqbal', order: 1 },
    { imageUrl: '/uploads/aca2.jpeg',   caption: 'Khansa', order: 2 },
    { imageUrl: '/uploads/alya.jpg',    caption: 'Alya',  order: 3 },
    { imageUrl: '/uploads/arin.jpg',    caption: 'Arin',  order: 4 },
    { imageUrl: '/uploads/helmi.jpg',   caption: 'Helmy', order: 5 },
    { imageUrl: '/uploads/iqbal.jpg',   caption: 'Iqbal', order: 6 },
    { imageUrl: '/uploads/putra.jpg',   caption: 'Putra', order: 7 },
    { imageUrl: '/uploads/yosa.jpg',    caption: 'Yossha',order: 8 },
  ];

  for (const gallery of galleries) {
    await prisma.gallery.upsert({
      where: { id: galleries.indexOf(gallery) + 1 },
      update: {},
      create: gallery,
    });
  }

  // Seed Admin default
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Seed selesai!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
