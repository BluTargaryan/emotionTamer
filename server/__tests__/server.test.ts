import request from 'supertest';
import app from '../server';

describe('Email Server API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Email service is running',
      });
    });
  });

  describe('POST /send-verification-email', () => {
    it('should send verification email successfully', async () => {
      // Mock nodemailer for this test
      const mockSendMail = jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        response: '250 Message accepted',
      });
      
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail,
        verify: jest.fn().mockResolvedValue(true),
      });

      const emailData = {
        email: 'test@example.com',
        code: '123456',
      };

      const response = await request(app)
        .post('/send-verification-email')
        .send(emailData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Verification email sent successfully',
      });

      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"EmotionTamer" <test@example.com>',
        to: 'test@example.com',
        subject: 'Verify Your Email - EmotionTamer',
        html: expect.stringContaining('123456'),
      });
    });

    it('should handle missing email field', async () => {
      const response = await request(app)
        .post('/send-verification-email')
        .send({ code: '123456' })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Email and code are required',
      });
    });

    it('should handle missing code field', async () => {
      const response = await request(app)
        .post('/send-verification-email')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Email and code are required',
      });
    });
  });

  describe('POST /send-password-reset-email', () => {
    it('should send password reset email successfully', async () => {
      // Mock nodemailer for this test
      const mockSendMail = jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        response: '250 Message accepted',
      });
      
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail,
        verify: jest.fn().mockResolvedValue(true),
      });

      const emailData = {
        email: 'test@example.com',
        code: '123456',
      };

      const response = await request(app)
        .post('/send-password-reset-email')
        .send(emailData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Password reset email sent successfully',
      });
    });

    it('should handle missing fields', async () => {
      const response = await request(app)
        .post('/send-password-reset-email')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Email and code are required',
      });
    });
  });

  describe('POST /test-email', () => {
    it('should send test email successfully', async () => {
      // Mock nodemailer for this test
      const mockSendMail = jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        response: '250 Message accepted',
      });
      
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail,
        verify: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .post('/test-email')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Test email sent successfully',
      });
    });

    it('should handle missing email field', async () => {
      const response = await request(app)
        .post('/test-email')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Email is required',
      });
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/send-verification-email')
        .expect(204);

      // CORS headers should be present
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/send-verification-email')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
    });
  });
}); 