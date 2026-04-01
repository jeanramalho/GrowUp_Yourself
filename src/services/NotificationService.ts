/**
 * NotificationService wrapper for expo-notifications
 * Handles scheduling and sending notifications for reminders
 */

import * as Notifications from 'expo-notifications';

/**
 * Notification configuration
 */
export interface NotificationConfig {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Scheduled notification result
 */
export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
}

/**
 * Notification trigger options
 */
export interface NotificationTrigger {
  type: 'time' | 'date' | 'interval';
  // For 'time': HH:MM format
  // For 'date': ISO 8601 string
  // For 'interval': milliseconds
  value: string | number;
}

/**
 * Service for managing notifications
 * Wrapper around expo-notifications with typed interfaces
 */
export class NotificationService {
  private initialized = false;

  /**
   * Initialize notification service
   * Should be called once during app startup
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      this.initialized = true;
      console.log('NotificationService initialized');
    } catch (error) {
      console.error('Failed to initialize NotificationService:', error);
      throw error;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Get current notification permissions status
   */
  async getPermissionsStatus(): Promise<string> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Failed to get permissions status:', error);
      return 'undetermined';
    }
  }

  /**
   * Schedule a notification at a specific time
   * @param trigger Time in HH:MM format or Date object
   * @param config Notification configuration
   */
  async scheduleNotification(
    trigger: string | Date,
    config: NotificationConfig
  ): Promise<string> {
    try {
      let triggerInput: Notifications.NotificationTriggerInput;

      if (trigger instanceof Date) {
        triggerInput = trigger;
      } else if (typeof trigger === 'string') {
        // Parse HH:MM format - use seconds since midnight for daily trigger
        const [hours, minutes] = trigger.split(':').map(Number);
        const secondsSinceMidnight = hours * 3600 + minutes * 60;
        triggerInput = {
          seconds: secondsSinceMidnight,
          repeats: true,
        } as any;
      } else {
        throw new Error('Invalid trigger format');
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: true,
          badge: 1,
        },
        trigger: triggerInput,
      });

      console.log(`Notification scheduled: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Schedule a recurring notification
   * @param intervalMinutes Minutes between each notification
   * @param config Notification configuration
   */
  async scheduleRecurringNotification(
    intervalMinutes: number,
    config: NotificationConfig
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: true,
          badge: 1,
        },
        trigger: {
          seconds: intervalMinutes * 60,
          repeats: true,
        } as any,
      });

      console.log(`Recurring notification scheduled: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule recurring notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Notification cancelled: ${notificationId}`);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      throw error;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
      throw error;
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      throw error;
    }
  }

  /**
   * Send a local notification immediately
   */
  async sendNotification(config: NotificationConfig): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: true,
          badge: 1,
        },
        trigger: null, // null trigger sends immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Listen for incoming notifications
   */
  onNotificationReceived(
    callback: (notification: Notifications.Notification) => void
  ): () => void {
    const subscription = Notifications.addNotificationReceivedListener(callback);
    return () => subscription.remove();
  }

  /**
   * Listen for notification responses (when user taps notification)
   */
  onNotificationResponse(
    callback: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const subscription = Notifications.addNotificationResponseReceivedListener(callback);
    return () => subscription.remove();
  }
}

/**
 * Singleton instance
 */
export const notificationService = new NotificationService();
