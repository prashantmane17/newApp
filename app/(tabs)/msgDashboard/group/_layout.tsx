import { Stack } from 'expo-router';

export default function MessagesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Groups',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="chatScreen"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="groupDetails"
                options={{
                    title: 'Group Details',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}