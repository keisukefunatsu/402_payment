import { NextRequest } from 'next/server';
import { GET as getContent } from '@/app/api/content/[id]/route';
import { GET as listContents, POST as createContent } from '@/app/api/content/route';
import * as sessionLib from '@/lib/session';
import * as firebaseLib from '@/lib/firebase-admin';

jest.mock('@/lib/session');
jest.mock('@/lib/firebase-admin');

describe('Content API', () => {
  const mockSession = {
    userId: 'test-user-123',
    sessionId: 'test-session-456',
    createdAt: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sessionLib.createUserSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/content/[id]', () => {
    it('should return 402 for unpurchased content', async () => {
      const mockContent = {
        preview: 'This is a preview',
        content: 'This is the full content',
        price: '1000000000000000', // 0.001 ETH in Wei
      };

      (firebaseLib.db.collection as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => mockContent,
          }),
        }),
      });

      (firebaseLib.hasContentAccess as jest.Mock).mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/content/123');
      const response = await getContent(request, { params: { id: '123' } });
      const data = await response.json();

      expect(response.status).toBe(402);
      expect(response.headers.get('X-Payment-Required')).toBe('true');
      expect(response.headers.get('X-Payment-Amount')).toBe('0.001');
      expect(response.headers.get('X-Content-Id')).toBe('123');
      expect(data.preview).toBe('This is a preview');
      expect(data.content).toBeUndefined();
    });

    it('should return full content for purchased content', async () => {
      const mockContent = {
        preview: 'This is a preview',
        content: 'This is the full content',
        price: '1000000000000000',
      };

      (firebaseLib.db.collection as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => mockContent,
          }),
        }),
      });

      (firebaseLib.hasContentAccess as jest.Mock).mockResolvedValue(true);

      const request = new NextRequest('http://localhost:3000/api/content/123');
      const response = await getContent(request, { params: { id: '123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe('This is the full content');
      expect(data.preview).toBeUndefined();
    });

    it('should return 404 for non-existent content', async () => {
      (firebaseLib.db.collection as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/999');
      const response = await getContent(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Content not found');
    });
  });

  describe('GET /api/content', () => {
    it('should list all contents without full content', async () => {
      const mockContents = [
        { id: '1', title: 'Content 1', preview: 'Preview 1', content: 'Full 1', price: '1000' },
        { id: '2', title: 'Content 2', preview: 'Preview 2', content: 'Full 2', price: '2000' },
      ];

      (firebaseLib.db.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockContents.map(content => ({
            id: content.id,
            data: () => ({ ...content, id: undefined }),
          })),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content');
      const response = await listContents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.contents).toHaveLength(2);
      expect(data.contents[0].content).toBeUndefined();
      expect(data.contents[0].preview).toBe('Preview 1');
    });
  });

  describe('POST /api/content', () => {
    it('should create new content', async () => {
      const mockAdd = jest.fn().mockResolvedValue({ id: 'new-content-123' });
      
      (firebaseLib.db.collection as jest.Mock).mockReturnValue({
        add: mockAdd,
      });

      const requestBody = {
        title: 'New Content',
        preview: 'This is a preview',
        content: 'This is the full content',
        price: 0.001,
      };

      const request = new NextRequest('http://localhost:3000/api/content', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await createContent(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('new-content-123');
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          creatorId: 'test-user-123',
          title: 'New Content',
          preview: 'This is a preview',
          content: 'This is the full content',
          price: '1000000000000000', // 0.001 ETH in Wei
        })
      );
    });

    it('should return 400 for missing fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/content', {
        method: 'POST',
        body: JSON.stringify({ title: 'Only Title' }),
      });

      const response = await createContent(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });
  });
});