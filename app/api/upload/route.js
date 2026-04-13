// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const token = getTokenFromRequest(req);
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file' }, { status: 400 });
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Hanya JPG, PNG, WEBP yang diizinkan' }, { status: 400 });
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file max 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nama file unik
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: 'Gagal upload ke storage' }, { status: 500 });
    }

    // Ambil public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal upload file' }, { status: 500 });
  }
}
