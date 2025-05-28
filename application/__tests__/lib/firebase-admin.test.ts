import { getUser, createUser, hasContentAccess, grantContentAccess, db } from '@/lib/firebase-admin';

// Mock firebase-admin
jest.mock('firebase-admin/app');
jest.mock('firebase-admin/firestore');

describe('Firebase Admin Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user data if exists', async () => {
      const mockUserData = { aaWalletAddress: '0x123', createdAt: new Date() };
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => mockUserData,
      });
      
      db.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: mockGet,
        }),
      });

      const result = await getUser('user123');

      expect(db.collection).toHaveBeenCalledWith('users');
      expect(result).toEqual(mockUserData);
    });

    it('should return null if user does not exist', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: false,
      });
      
      db.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: mockGet,
        }),
      });

      const result = await getUser('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user with timestamp', async () => {
      const mockSet = jest.fn().mockResolvedValue(undefined);
      
      db.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          set: mockSet,
        }),
      });

      const userData = { aaWalletAddress: '0x456' };
      await createUser('user123', userData);

      expect(mockSet).toHaveBeenCalledWith({
        ...userData,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('hasContentAccess', () => {
    it('should return true if access exists', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
      });
      
      db.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
              get: mockGet,
            }),
          }),
        }),
      });

      const result = await hasContentAccess('content123', 'user123');

      expect(result).toBe(true);
    });

    it('should return false if access does not exist', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: false,
      });
      
      db.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
              get: mockGet,
            }),
          }),
        }),
      });

      const result = await hasContentAccess('content123', 'user123');

      expect(result).toBe(false);
    });
  });

  describe('grantContentAccess', () => {
    it('should grant access with timestamp', async () => {
      const mockSet = jest.fn().mockResolvedValue(undefined);
      
      db.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
              set: mockSet,
            }),
          }),
        }),
      });

      await grantContentAccess('content123', 'user123');

      expect(mockSet).toHaveBeenCalledWith({
        grantedAt: expect.any(Date),
      });
    });
  });
});