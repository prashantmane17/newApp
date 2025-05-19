
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

import React from 'react';
import { SessionProvider } from '@/context/ContextSession';
import { MainStackLayout } from '@/components/MainStackLayout';


export default function StackLayout() {
  return (
    <SessionProvider>
      <MainStackLayout />
    </SessionProvider>
  );
}

