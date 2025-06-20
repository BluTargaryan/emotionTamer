import { EmailService } from '../emailService';

// Mock global fetch
global.fetch = jest.fn();

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification email sent successfully',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await EmailService.sendVerificationEmail(
        'test@example.com',
        '123456'
      );

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/send-verification-email'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            code: '123456',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await EmailService.sendVerificationEmail(
        'test@example.com',
        '123456'
      );

      expect(result).toEqual({
        success: false,
        message: 'Unable to connect to email service. Please check your internet connection.',
      });
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset email sent successfully',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await EmailService.sendPasswordResetEmail(
        'test@example.com',
        '654321'
      );

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/send-password-reset-email'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            code: '654321',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('testEmail', () => {
    it('should send test email successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Test email sent to test@example.com',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await EmailService.testEmail('test@example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-email'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('checkServiceHealth', () => {
    it('should return true for healthy service', async () => {
      const mockResponse = {
        status: 'OK',
        message: 'Email service is running',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await EmailService.checkServiceHealth();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/health')
      );

      expect(result).toBe(true);
    });

    it('should return false for unhealthy service', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Service unavailable')
      );

      const result = await EmailService.checkServiceHealth();

      expect(result).toBe(false);
    });

    it('should return false for non-OK status', async () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Service is down',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await EmailService.checkServiceHealth();

      expect(result).toBe(false);
    });
  });
}); 