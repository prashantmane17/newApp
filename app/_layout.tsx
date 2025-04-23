import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { requestAllPermissions } from '@/utils/permissions';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider, useSession } from '@/context/ContextSession';
import { useRouter } from 'expo-router';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { sessionData, getSessionDetails } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // First useEffect for initialization
  useEffect(() => {
    const initialize = async () => {
      try {
        await getSessionDetails();
        if (loaded) {
          await SplashScreen.hideAsync();
          const { allGranted } = await requestAllPermissions();
          if (!allGranted) {
            console.log('Some permissions were not granted');
          }
          setIsInitialized(true);
          // Add a small delay to show the loader
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initialize();
  }, [loaded]);

  // Second useEffect for navigation after initialization
  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (sessionData?.loginId) {
        router.replace('/(tabs)/msgDashboard');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isInitialized, isLoading, sessionData]);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SessionProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
