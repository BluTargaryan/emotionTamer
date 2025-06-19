// Email service for communicating with the nodemailer server
// For React Native development - replace with your computer's IP address
const EMAIL_SERVER_URL =  'http://10.110.198.132:3001'; 

interface EmailResponse {
  success: boolean;
  message: string;
}

export class EmailService {
  private static async makeRequest(endpoint: string, data: any): Promise<EmailResponse> {
    try {
      const response = await fetch(`${EMAIL_SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Unable to connect to email service. Please check your internet connection.',
      };
    }
  }

  static async sendVerificationEmail(email: string, code: string): Promise<EmailResponse> {
    return this.makeRequest('/send-verification-email', { email, code });
  }

  static async sendPasswordResetEmail(email: string, code: string): Promise<EmailResponse> {
    return this.makeRequest('/send-password-reset-email', { email, code });
  }

  static async testEmail(email: string): Promise<EmailResponse> {
    return this.makeRequest('/test-email', { email });
  }

  static async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${EMAIL_SERVER_URL}/health`);
      const result = await response.json();
      return result.status === 'OK';
    } catch (error) {
      console.error('Email service health check failed:', error);
      return false;
    }
  }
}

export default EmailService; 