// Stub notifications service (injetável)
export const scheduleNotification = async (id: string, timestamp: number, payload: any) => {
  // In production, use Expo Notifications or native APIs
  return true;
};

export const cancelNotification = async (id: string) => {
  return true;
};
