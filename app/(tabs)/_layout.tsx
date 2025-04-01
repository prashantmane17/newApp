import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Clock, Dock, Group, Home, MessageCircleCode, User, Users } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          android: {
            paddingBottom: 10, // Prevent overlapping
            height: 60, // Adjust height if needed
            position: 'relative',
          },
          default: {},
        }),
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MessageCircleCode size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: 'Group',
          tabBarIcon: ({ color }) => <Users size={20} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="payslip"
        options={{
          title: 'Payslip',
          tabBarIcon: ({ color }) => <Dock size={20} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
