import { Stack } from 'expo-router';

export default function MessagesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Messages',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="payslips"
                options={{
                    title: 'Payslips',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="attendance"
                options={{
                    title: 'Attendance',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}