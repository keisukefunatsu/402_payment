import { createUserSession, getSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

jest.mock('next/headers');
jest.mock('iron-session');

describe('Session Management', () => {
  const mockCookies = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  const mockSession = {
    userId: undefined as string | undefined,
    sessionId: undefined as string | undefined,
    createdAt: undefined as number | undefined,
    save: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookies);
    (getIronSession as jest.Mock).mockResolvedValue(mockSession);
    
    // Reset session data
    mockSession.userId = undefined;
    mockSession.sessionId = undefined;
    mockSession.createdAt = undefined;
  });

  describe('getSession', () => {
    it('should return session from iron-session', async () => {
      const session = await getSession();
      
      expect(cookies).toHaveBeenCalled();
      expect(getIronSession).toHaveBeenCalledWith(
        mockCookies,
        expect.objectContaining({
          cookieName: '402-payment-session',
          password: expect.any(String),
        })
      );
      expect(session).toBe(mockSession);
    });
  });

  describe('createUserSession', () => {
    it('should create new session for new user', async () => {
      const session = await createUserSession();

      expect(session.userId).toMatch(/^user_\d+_[a-z0-9]+$/);
      expect(session.sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(session.createdAt).toBeGreaterThan(0);
      expect(mockSession.save).toHaveBeenCalled();
    });

    it('should return existing session for returning user', async () => {
      // Set existing session data
      mockSession.userId = 'existing_user_123';
      mockSession.sessionId = 'existing_session_456';
      mockSession.createdAt = Date.now() - 1000;

      const session = await createUserSession();

      expect(session.userId).toBe('existing_user_123');
      expect(session.sessionId).toBe('existing_session_456');
      expect(mockSession.save).not.toHaveBeenCalled();
    });
  });
});