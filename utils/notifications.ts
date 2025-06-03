import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const TOKEN_KEY = '@expo_push_token';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    alert('Must use physical device for Push Notifications');
    return null;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function getStoredPushToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function sendTestNotification() {
  const token = await getStoredPushToken();
  if (!token) {
    alert('No push token found. Register first.');
    return;
  }
  // Local notification for dev; real push would use backend
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test Notification',
      body: 'This is a test push notification!',
    },
    trigger: null,
  });
}

// Listen for notifications
export function addNotificationListeners(onReceive, onResponse) {
  const sub1 = Notifications.addNotificationReceivedListener(onReceive);
  const sub2 = Notifications.addNotificationResponseReceivedListener(onResponse);
  return () => {
    sub1.remove();
    sub2.remove();
  };
}

export async function sendLocalNotification({ title, body, data = {} }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null,
  });
}

export function addNotificationTapListener(onTap) {
  // onTap: (response) => void
  return Notifications.addNotificationResponseReceivedListener(onTap);
}

// TODO: Integrate with backend (Supabase) to store/send tokens for real push 