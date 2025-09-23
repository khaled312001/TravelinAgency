/**
 * WhatsApp notification interfaces for Twilio integration
 * These types define the structure for WhatsApp notifications sent via Twilio
 */

export interface WhatsAppNotification {
  to: string;
  templateName: string;
  language: 'en_US' | 'ar';
  parameters: WhatsAppParameter[];
}

export interface WhatsAppParameter {
  type: 'text' | 'image' | 'document';
  text?: string;
  image?: {
    link: string;
  };
  document?: {
    link: string;
  };
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface PackageInquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  packageId: string;
  packageName: string;
  message: string;
  locale?: string;
  createdAt?: string;
  notificationSent?: boolean;
  notificationId?: string;
  notificationError?: string;
}

export interface DestinationInquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  destinationName: string;
  message: string;
  locale?: string;
  createdAt?: string;
  notificationSent?: boolean;
  notificationId?: string;
  notificationError?: string;
}
