import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MessageInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
}

export default function MessageInput({
    value,
    onChangeText,
    onSend,
}: MessageInputProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.attachButton}>
                <Feather name="plus-circle" size={24} color="#6b7280" />
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                multiline
            />

            <TouchableOpacity
                style={[
                    styles.sendButton,
                    !value.trim() && styles.disabledButton
                ]}
                onPress={onSend}
                disabled={!value.trim()}
            >
                <Feather name="send" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        ...Platform.select({
            ios: {
                paddingBottom: 24, // Extra padding for iOS to account for home indicator
            },
        }),
    },
    attachButton: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#6366f1',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#a5b4fc',
    },
});