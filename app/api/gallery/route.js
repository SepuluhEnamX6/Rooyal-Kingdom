// app/api/gallery/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET semua gallery (public)
export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(gallery);
  } catch {
    return NextResponse.json({ error: 'Gagal ambil data gallery' }, { status: 500 });
  }
}

// POST tambah foto gallery (admin only)
export async function POST(req) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { imageUrl, caption, order } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl wajib diisi' }, { status: 400 });
    }

    const photo = await prisma.gallery.create({
      data: { imageUrl, caption: caption || null, order: order || 0 },
    });
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal tambah foto' }, { status: 500 });
  }
}
