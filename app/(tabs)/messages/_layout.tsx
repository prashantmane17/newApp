import { Stack } from 'expo-router';

export default function MessagesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Messages',
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    headerShown: true,
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}