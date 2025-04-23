import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import MessageInput from '@/components/MessageInput';
import { mockGroups, mockMessages } from '@/constants/mockData';
import { router, useLocalSearchParams } from 'expo-router';


export default function GroupChatScreen() {


    const { groupId } = useLocalSearchParams();
    const [group, setGroup] = useState<(typeof mockGroups)[0] | undefined>(undefined);
    const [messages, setMessages] = useState<typeof mockMessages>([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Find the group by ID
        const foundGroup = mockGroups.find((g) => g.id === groupId);
        if (foundGroup) {
            setGroup(foundGroup);
            // Get messages for this group
            const groupMessages = mockMessages.filter((m) => m.groupId === groupId);
            setMessages(groupMessages);
        }
    }, [groupId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            id: `msg-${Date.now()}`,
            groupId,
            senderId: 'current-user',
            senderName: 'You',
            content: newMessage,
            timestamp: new Date().toISOString(),
        };
        const newMSG = [...messages, message]
        setMessages(newMSG);
        setNewMessage('');

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => {
        const isCurrentUser = item.senderId === 'current-user';

        return (
            <View style={[
                styles.messageContainer,
                isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer
            ]}>
                <View style={[
                    styles.messageBubble,
                    isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
                ]}>
                    {!isCurrentUser && (
                        <Text style={styles.senderName}>{item.senderName}</Text>
                    )}
                    <Text style={[
                        styles.messageText,
                        isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={[
                        styles.timeText,
                        isCurrentUser ? styles.currentUserTimeText : styles.otherUserTimeText
                    ]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    if (!group) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Feather name="arrow-left" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: group.image }}
                        style={styles.groupImage}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <Text style={styles.membersText}>{group.members.length} members</Text>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
                        </View>
                    }
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                <MessageInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    onSend={handleSendMessage}
                />
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        marginRight: 16,
    },
    groupImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 16,
        fontWeight: '600',
    },
    membersText: {
        fontSize: 12,
        color: '#6b7280',
    },
    messagesList: {
        padding: 16,
        paddingBottom: 24,
    },
    messageContainer: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    currentUserMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherUserMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    currentUserBubble: {
        backgroundColor: '#6366f1',
        borderBottomRightRadius: 4,
    },
    otherUserBubble: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
    },
    senderName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6366f1',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
    },
    currentUserMessageText: {
        color: 'white',
    },
    otherUserMessageText: {
        color: '#1f2937',
    },
    timeText: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    currentUserTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherUserTimeText: {
        color: '#6b7280',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6b7280',
        textAlign: 'center',
    },
});