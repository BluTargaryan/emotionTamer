// Jest setup file for server testing
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock nodemailer
const mockSendMail = jest.fn().mockResolvedValue({
  messageId: 'test-message-id',
  response: '250 Message accepted',
});

const mockTransporter = {
  sendMail: mockSendMail,
  verify: jest.fn().mockResolvedValue(true),
};

const mockCreateTransport = jest.fn(() => mockTransporter);

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport,
}));

// Export mocks for use in tests
export { mockCreateTransport, mockSendMail, mockTransporter };

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.EMAIL_HOST = 'smtp.test.com';
process.env.EMAIL_PORT = '587';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';
process.env.EMAIL_FROM = 'test@example.com';
process.env.APP_NAME = 'EmotionTamer Test';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.PORT = '3001';

// Global test setup
beforeEach(() => {
  jest.clearAllMocks();
});

// Silence console logs in tests unless explicitly testing them
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 