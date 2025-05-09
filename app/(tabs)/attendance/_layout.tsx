import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';

export default function StackLayout() {
  const colorScheme = useColorScheme();

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
        <Stack.Screen name="leave" options={{ title: 'Leave', headerShown: false }} />

      </Stack>
    </View>
  );
}
