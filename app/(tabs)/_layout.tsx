
// import { Stack } from 'expo-router';
// import React from 'react';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Colors } from '@/constants/Colors';
// import { SessionProvider } from '@/context/ContextSession';

// export default function StackLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <SessionProvider>
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: Colors[colorScheme ?? 'light'].background,
//           },
//           headerTintColor: Colors[colorScheme ?? 'light'].text,
//         }}
//       >
//         <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
//         <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
//         <Stack.Screen name="msgDashboard" options={{ title: 'Explore', headerShown: false }} />
//       </Stack>
//     </SessionProvider >
//   );
// }










import { Stack } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { SessionProvider, useSession } from '@/context/ContextSession';
import { useRouter, usePathname } from 'expo-router';
import { MessageSquare, DollarSign, Settings, User, LogOut, TicketPlus } from 'lucide-react-native';

type RouteType = '/(tabs)/msgDashboard' | '/(tabs)/payroll' | '/(tabs)/settings' | '/(tabs)/profile' | '/(tabs)/logout';

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const { handleLogout } = useSession();
  const navigationItems: { name: string; route: RouteType; icon: React.ReactNode }[] = [
    {
      name: 'Message',
      route: '/(tabs)/msgDashboard',
      icon: <MessageSquare size={24} />
    },
    {
      name: 'Payroll',
      route: '/(tabs)/payslip',
      icon: <DollarSign size={24} />
    },
    {
      name: 'Attendance',
      route: '/(tabs)/attendance',
      icon: <User size={24} />
    },
    {
      name: 'Settings',
      route: '/(tabs)/profile',
      icon: <Settings size={24} />
    },

  ];

  return (
    <SessionProvider>
      <View style={styles.container}>
        {/* <View style={pathname === '/' ? styles.content : styles.screenContent}> */}
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              },
              headerTintColor: Colors[colorScheme ?? 'light'].text,
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
            <Stack.Screen name="msgDashboard" options={{ title: 'Explore', headerShown: false }} />
            <Stack.Screen name="payslip" options={{ title: 'Payslip', headerShown: false }} />
            <Stack.Screen name="attendance" options={{ title: 'Attendance', headerShown: false }} />
            <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
          </Stack>
        </View>

        {/* Custom Bottom Navigation (hidden on '/') */}
        {pathname !== '/' && (
          <View style={styles.bottomNav}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.navItem,
                  pathname === item.route ? styles.activeItem : null
                ]}
                onPress={() => router.push(item.route as any)}
              >
                {React.cloneElement(item.icon as React.ReactElement, {
                  color: "white"
                })}
                <Text style={styles.navText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleLogout()}
            >
              <LogOut size={24} color="red" />
              <Text style={styles.navText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    // paddingBottom: 60,
  },
  screenContent: {
    flex: 1,
    paddingBottom: 60,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#06607a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  activeItem: {
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: 'white',
  },
});
