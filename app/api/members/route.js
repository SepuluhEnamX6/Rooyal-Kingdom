// app/api/members/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET semua member (public)
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(members);
  } catch (err) {
    return NextResponse.json({ error: 'Gagal ambil data member' }, { status: 500 });
  }
}

// POST tambah member baru (admin only)
export async function POST(req) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, photo, instagram, order } = body;

    if (!name || !role || !photo) {
      return NextResponse.json({ error: 'name, role, photo wajib diisi' }, { status: 400 });
    }

    const member = await prisma.member.create({
      data: { name, role, photo, instagram: instagram || null, order: order || 0 },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal tambah member' }, { status: 500 });
  }
}
