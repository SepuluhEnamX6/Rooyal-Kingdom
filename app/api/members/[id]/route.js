// app/api/members/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET satu member
export async function GET(req, { params }) {
  const member = await prisma.member.findUnique({ where: { id: Number(params.id) } });
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(member);
}

// PUT update member (admin only)
export async function PUT(req, { params }) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, role, photo, instagram, order } = body;

    const member = await prisma.member.update({
      where: { id: Number(params.id) },
      data: { name, role, photo, instagram, order },
    });
    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: 'Gagal update member' }, { status: 500 });
  }
}

// DELETE member (admin only)
export async function DELETE(req, { params }) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.member.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Gagal hapus member' }, { status: 500 });
  }
}
