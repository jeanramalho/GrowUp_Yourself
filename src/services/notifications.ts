/**
 * Notifications Service
 * Handles local notifications for reminders, alerts, and confirmations
 *
 * Platform Notes:
 * - iOS: Uses expo-notifications (requires permissions)
 * - Android: Uses expo-notifications with native scheduling
 * - Web: Uses browser Notification API (if available)
 *
 * Privacy: All notifications are local; no data sent to external services
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export interface NotificationOptions {
  title: string;
  body: string;
  data?: Record<string, string | number | boolean>;
  badge?: number;
  sound?: boolean;
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
}

export interface ScheduledNotificationOptions extends NotificationOptions {
  trigger: {
    seconds?: number;
    hour?: number;
    minute?: number;
    repeats?: boolean;
  };
}

/**
 * Initialize notifications
 * Must be called once on app startup
 */
export async function initializeNotifications(): Promise<void> {
  if (Platform.OS === 'web') {
    // Web: Check browser support
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.warn('Notification permission denied (web):', error);
      }
    }
    return;
  }

  // Native (iOS/Android)
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission not granted');
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }

  // Configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/**
 * Send immediate notification
 * @param options - Notification options
 */
export async function sendNotification(options: NotificationOptions): Promise<string | null> {
  if (Platform.OS === 'web') {
    return sendWebNotification(options);
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        badge: options.badge,
        sound: options.sound !== false,
        _displayInForeground: true,
      },
      trigger: { seconds: 1 }, // Immediate
    });

    return notificationId;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
}

/**
 * Schedule notification for future time
 * @param options - Scheduled notification options
 */
export async function scheduleNotification(
  options: ScheduledNotificationOptions,
): Promise<string | null> {
  if (Platform.OS === 'web') {
    console.warn('Web platform: scheduled notifications not supported');
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        badge: options.badge,
        sound: options.sound !== false,
        _displayInForeground: true,
      },
      trigger: {
        seconds: options.trigger.seconds,
        hour: options.trigger.hour,
        minute: options.trigger.minute,
        repeats: options.trigger.repeats || false,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 * @param notificationId - ID returned from schedule/send
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.ScheduledNotificationRequest[]> {
  if (Platform.OS === 'web') {
    return [];
  }

  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

/**
 * Web notification helper
 */
function sendWebNotification(options: NotificationOptions): string {
  try {
    const notification = new Notification(options.title, {
      body: options.body,
      badge: '/icon-192x192.png',
      icon: '/icon-192x192.png',
      tag: 'growup-notification',
    });

    return notification.toString();
  } catch (error) {
    console.error('Error sending web notification:', error);
    return '';
  }
}

/**
 * Setup notification listeners
 * Call this in your app root component's useEffect
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void,
): () => void {
  if (Platform.OS === 'web') {
    return () => {}; // No-op for web
  }

  const subscription1 = Notifications.addNotificationResponseReceivedListener((response) => {
    onNotificationTapped?.(response);
  });

  const subscription2 = Notifications.addNotificationReceivedListener((notification) => {
    onNotificationReceived?.(notification);
  });

  return () => {
    subscription1.remove();
    subscription2.remove();
  };
}

export default {
  initializeNotifications,
  sendNotification,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  setupNotificationListeners,
};
