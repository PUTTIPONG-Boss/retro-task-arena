import { apiClient } from '@/lib/api';
import { AppNotification } from '@/store/notificationStore';

export interface BackendNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  payload: string;
  read: boolean;
  createdAt: string;
}

function toAppNotification(n: BackendNotification): AppNotification {
  return {
    id: n.id,
    message: n.message,
    timestamp: new Date(n.createdAt),
    read: n.read,
    type: n.type === 'bid_accepted' ? 'bid' : 'general',
  };
}

export async function fetchUnreadNotifications(): Promise<AppNotification[]> {
  const res = await apiClient.get<BackendNotification[]>('/user/notifications');
  return res.data.map(toAppNotification);
}

export async function markNotificationsRead(): Promise<void> {
  await apiClient.patch('/user/notifications/read');
}
