export const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn(),
  set: jest.fn(),
  add: jest.fn(),
  exists: false,
  data: jest.fn(),
};

export const getFirestore = jest.fn(() => mockFirestore);

export const initializeApp = jest.fn();
export const cert = jest.fn();
export const getApps = jest.fn(() => []);