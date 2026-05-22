import { apiClient } from '@/lib/api';
import { AppNotification } from '@/store/notificationStore';

export interface BackendNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

function toAppNotification(n: BackendNotification): AppNotification {
  const data = n.data || {};
  let i18nKey: string | undefined;
  let i18nParams: Record<string, string> | undefined;
  let questId: string | undefined = data.taskId;

  if (n.type === 'bid' || n.type === 'new_bid') {
    i18nKey = 'notifications.newBid';
    i18nParams = { title: data.taskTitle || '', amount: String(data.bidAmount || '') };
  } else if (n.type === 'work_submitted') {
    i18nKey = 'notifications.workSubmitted';
    i18nParams = { title: data.taskTitle || '' };
  } else if (n.type === 'bid_accepted') {
    i18nKey = 'notifications.bidAccepted';
    i18nParams = { title: data.taskTitle || '' };
  } else if (n.type === 'work_approved') {
    i18nKey = 'notifications.workApproved';
    i18nParams = { title: data.taskTitle || '', points: data.pointsAwarded ? ` (+${data.pointsAwarded} GP)` : '' };
  } else if (n.type === 'changes_requested') {
    i18nKey = 'notifications.changesRequested';
    i18nParams = { title: data.taskTitle || '', comment: data.comment ? `: ${data.comment}` : '' };
  } else if (n.type === 'bid_rejected') {
    i18nKey = 'notifications.bidRejected';
    i18nParams = { title: data.taskTitle || '' };
  } else if (n.type === 'team_added' || n.type === 'added_to_bid' || n.type === 'team_bid_invited') {
    i18nKey = 'notifications.teamAdded';
    i18nParams = { title: data.taskTitle || '' };
    questId = data.taskId;
  }

  return {
    id: n.id,
    userId: n.userId,
    message: n.message,
    timestamp: new Date(n.createdAt),
    read: n.isRead,
    type: (n.type === 'bid' || n.type === 'new_bid' || n.type === 'bid_accepted' || n.type === 'bid_rejected' || n.type === 'team_added' || n.type === 'added_to_bid' || n.type === 'team_bid_invited') ? 'bid' : 'general',
    i18nKey,
    i18nParams,
    questId,
  };
}

export async function fetchUnreadNotifications(): Promise<AppNotification[]> {
  const res = await apiClient.get<BackendNotification[]>('/user/notifications');
  return res.data
    .filter((n) => n.type !== 'task_status')
    .map(toAppNotification);
}

export async function markNotificationsRead(): Promise<void> {
  await apiClient.patch('/user/notifications/read');
}