import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';
import { useSession } from '@/context/ContextSession';

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const { sessionData, getSessionDetails } = useSession();
  useEffect(() => {
    if (sessionData === null) {
      getSessionDetails();
    }

  }, [sessionData])
  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTintColor: Colors[colorScheme ?? 'light'].text,
        }}
      >

        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="messages" options={{ title: 'Messages', headerShown: false }} />
        <Stack.Screen name="payslip" options={{ title: 'Payslip', headerShown: false }} />
        <Stack.Screen name="group" options={{ title: 'Group', headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
      </Stack>
    </View>
  );
}
