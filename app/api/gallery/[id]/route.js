// app/api/gallery/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// DELETE foto gallery (admin only)
export async function DELETE(req, { params }) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.gallery.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Gagal hapus foto' }, { status: 500 });
  }
}

// PUT update caption/order
export async function PUT(req, { params }) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const photo = await prisma.gallery.update({
      where: { id: Number(params.id) },
      data: { caption: body.caption, order: body.order },
    });
    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: 'Gagal update foto' }, { status: 500 });
  }
}
