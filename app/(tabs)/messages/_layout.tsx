import { Stack } from 'expo-router';

export default function MessagesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'People',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="teamChat"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="companyChat"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="workplaceChat"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}