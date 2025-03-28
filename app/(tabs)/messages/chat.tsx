import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Send } from 'lucide-react-native';

export default function ChatScreen() {
    const { name, avatar } = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hey there!', sent: true },
        { id: 2, text: 'Hi! How are you?', sent: false },
        { id: 3, text: 'I\'m good, thanks!', sent: true },
    ]);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([
                ...messages,
                { id: messages.length + 1, text: message, sent: true },
            ]);
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Image source={{ uri: avatar as string }} style={styles.avatar} />
                <Text style={styles.headerName}>{name}</Text>
            </View>

            <ScrollView style={styles.messagesContainer}>
                {messages.map(msg => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageBubble,
                            msg.sent ? styles.sentMessage : styles.receivedMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Send color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    messagesContainer: {
        flex: 1,
        padding: 15,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});