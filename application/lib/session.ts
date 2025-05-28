import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId?: string;
  sessionId?: string;
  createdAt?: number;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: '402-payment-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function createUserSession(): Promise<SessionData> {
  const session = await getSession();
  
  if (!session.userId) {
    // Generate new user ID and session ID
    session.userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    session.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    session.createdAt = Date.now();
    await session.save();
  }
  
  return session;
}