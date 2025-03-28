import { View, Text, Button, StyleSheet, Image } from 'react-native';

interface WelcomeScreenProps {
    onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
    return (
        <View style={styles.container}>
            {/* <Image source={require('@/assets/welcome.png')} style={styles.image} /> */}
            <Text style={styles.title}>Welcome to the App!</Text>
            <Text style={styles.subtitle}>Discover amazing features by signing in.</Text>
            <Button title="Get Started" onPress={onNext} color="#007bff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
});
