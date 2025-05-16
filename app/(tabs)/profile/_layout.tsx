import { Stack } from 'expo-router';

export default function MessagesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'profile',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="password"
                options={{
                    title: 'password',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="superAdminProfile"
                options={{
                    title: 'superAdminProfile',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}