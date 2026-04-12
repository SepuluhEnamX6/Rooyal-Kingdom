// lib/auth.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const cookie = req.cookies?.get?.('rk_token')?.value;
  if (cookie) return cookie;
  const header = req.headers.get?.('authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}
