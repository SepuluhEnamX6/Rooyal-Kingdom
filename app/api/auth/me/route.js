// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(req) {
  const token = getTokenFromRequest(req);
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ username: payload.username });
}
