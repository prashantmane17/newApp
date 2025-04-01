import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CreateGroupModal from '@/components/CreateGroupModal';
import { mockGroups } from '@/constants/mockData';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const router = useRouter()
    const handleGroupPress = (groupId: string) => {
        router.push({
            pathname: '/(tabs)/group/chatScreen',
            params: { groupId: groupId }
        })
    };

    const renderGroupItem = ({ item }: { item: typeof mockGroups[0] }) => (
        <TouchableOpacity
            style={styles.groupItem}
            onPress={() => handleGroupPress(item.id)}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.groupImage}
            />
            <View style={styles.groupInfo}>
                <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.lastMessageTime}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Group Chats</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setIsCreateModalVisible(true)}
                >
                    <Text style={styles.createButtonText}>Create Group</Text>
                    <Feather name="plus" size={16} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={mockGroups}
                renderItem={renderGroupItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No groups yet. Create your first group!</Text>
                    </View>
                }
            />

            <CreateGroupModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onCreateGroup={(groupId) => {
                    setIsCreateModalVisible(false);
                    // navigation.navigate('GroupChat', { groupId });
                    router.push({
                        pathname: '/(tabs)/group/chatScreen',
                        params: { groupId: groupId }
                    })
                }
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight || 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6366f1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    createButtonText: {
        color: 'white',
        marginRight: 8,
        fontWeight: '500',
    },
    list: {
        padding: 16,
    },
    groupItem: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    groupImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    groupInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    groupName: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeText: {
        fontSize: 12,
        color: '#6b7280',
    },
    lastMessage: {
        fontSize: 14,
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