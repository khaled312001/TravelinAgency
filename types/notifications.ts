export interface AdminNotification {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'contact' | 'package' | 'destination' | 'booking';
  title: string;
  description: string;
  created_at: string;
  is_read: boolean;
  package_name?: string;
  destination_name?: string;
}

export interface NotificationCounts {
  contact: number;
  package: number;
  destination: number;
  booking: number;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: AdminNotification[];
    totalUnread: number;
    counts: NotificationCounts;
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}
