import { AppNotification } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const STORAGE_KEY = "@app_notifications";
const UNREAD_KEY = "@app_notifications_unread";

export async function saveNotificationToHistory(
  notif: AppNotification,
): Promise<AppNotification[]> {
  const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
  const existing: AppNotification[] = existingRaw
    ? JSON.parse(existingRaw)
    : [];

  if (existing.some((item) => item.id === notif.id)) {
    return existing;
  }

  const updated = [notif, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  await AsyncStorage.setItem(UNREAD_KEY, "true");
  return updated;
}

export async function getStoredNotifications(): Promise<{
  notifications: AppNotification[];
  hasUnread: boolean;
}> {
  const [raw, unreadRaw] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEY),
    AsyncStorage.getItem(UNREAD_KEY),
  ]);
  return {
    notifications: raw ? JSON.parse(raw) : [],
    hasUnread: unreadRaw === "true",
  };
}

export async function markNotificationsAsRead(): Promise<void> {
  await AsyncStorage.setItem(UNREAD_KEY, "false");
}

export async function triggerLocalNotification(
  title: string,
  body: string,
): Promise<void> {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });

  await saveNotificationToHistory({
    id: identifier,
    title,
    body,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
}
