import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider } from '@/context/ContextSession';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const prepareApp = async () => {
      // Request Contacts Permission
      const { status: contactStatus } = await Contacts.requestPermissionsAsync();
      if (contactStatus !== 'granted') {
        Alert.alert('Contacts permission denied');
      }

      // Request Media Library Permission
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert('Media access permission denied');
      }

      // Hide splash screen after permissions and fonts are ready
      if (loaded) {
        await SplashScreen.hideAsync();
      }
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

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('✅ Expo Push Token:', token);
        return token;
      } else {
        alert('Must use physical device for Push Notifications');
        return null;
      }
    };

    prepareApp();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </SessionProvider>
    </ThemeProvider>
  );
}
