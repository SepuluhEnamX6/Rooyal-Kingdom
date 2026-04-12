// app/page.js
import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

// Fetch data dari DB di server
export default async function HomePage() {
  const [members, gallery] = await Promise.all([
    prisma.member.findMany({ orderBy: { order: 'asc' } }),
    prisma.gallery.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return <HomeClient members={members} gallery={gallery} />;
}
