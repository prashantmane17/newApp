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
                name="allPayslips"
                options={{
                    title: 'allpayslips',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="payslipModal"
                options={{
                    title: 'payslipModal',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="payslipTemplate2"
                options={{
                    title: 'Temp2',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="payslipTemplate3"
                options={{
                    title: 'Temp3',
                    headerShown: false,
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}