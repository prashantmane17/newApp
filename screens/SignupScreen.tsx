import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('https://your-backend-url.com/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // router.replace('(tabs)'); // Redirect to main app
            } else {
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
            <Button title="Sign Up" onPress={handleSignup} />
            <Button title="Back to Login" onPress={() => router.replace('/login')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    input: { width: '80%', padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 5 },
});
