
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { SessionProvider } from '@/context/ContextSession';

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
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
      </Stack>
    </SessionProvider >
  );
}










// import { Stack } from 'expo-router';
// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Colors } from '@/constants/Colors';
// import { SessionProvider } from '@/context/ContextSession';
// import { useRouter, usePathname } from 'expo-router';
// import { MessageSquare, DollarSign, Settings, User, LogOut } from 'lucide-react-native';

// type RouteType = '/(tabs)/msgDashboard' | '/(tabs)/payroll' | '/(tabs)/settings' | '/(tabs)/profile' | '/(tabs)/logout';

// export default function StackLayout() {
//   const colorScheme = useColorScheme();
//   const router = useRouter();
//   const pathname = usePathname();

//   const navigationItems: { name: string; route: RouteType; icon: React.ReactNode }[] = [
//     {
//       name: 'Message',
//       route: '/(tabs)/msgDashboard',
//       icon: <MessageSquare size={24} />
//     },
//     {
//       name: 'Payroll',
//       route: '/(tabs)/payroll',
//       icon: <DollarSign size={24} />
//     },
//     {
//       name: 'Settings',
//       route: '/(tabs)/settings',
//       icon: <Settings size={24} />
//     },
//     {
//       name: 'Profile',
//       route: '/(tabs)/profile',
//       icon: <User size={24} />
//     },
//     {
//       name: 'Logout',
//       route: '/(tabs)/logout',
//       icon: <LogOut size={24} />
//     }
//   ];

//   return (
//     <SessionProvider>
//       <View style={styles.container}>
//         <View style={styles.content}>
//           <Stack
//             screenOptions={{
//               headerStyle: {
//                 backgroundColor: Colors[colorScheme ?? 'light'].background,
//               },
//               headerTintColor: Colors[colorScheme ?? 'light'].text,
//             }}
//           >
//             <Stack.Screen name="msgDashboard" options={{ title: 'Messages', headerShown: false }} />
//             <Stack.Screen name="payroll" options={{ title: 'Payroll', headerShown: false }} />
//             <Stack.Screen name="settings" options={{ title: 'Settings', headerShown: false }} />
//             <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
//             <Stack.Screen name="logout" options={{ title: 'Logout', headerShown: false }} />
//           </Stack>
//         </View>

//         {/* Custom Bottom Navigation */}
//         <View style={[
//           styles.bottomNav

//         ]}>
//           {navigationItems.map((item) => (
//             <TouchableOpacity
//               key={item.name}
//               style={styles.navItem}
//               onPress={() => router.push(item.route as any)}
//             >
//               {React.cloneElement(item.icon as React.ReactElement, {
//                 color: pathname === item.route ? "blue" : "white"
//               })}
//               <Text style={[
//                 styles.navText,
//                 { color: pathname === item.route ? "blue" : "white" }
//               ]}>
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </SessionProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     paddingBottom: 60,
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 10,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     backgroundColor: '#06607a',
//     backdropFilter: 'blur(20px)',
//     boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.15)',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
// });
