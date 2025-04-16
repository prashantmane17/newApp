import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { useSession } from '@/context/ContextSession';

export default function HomeScreen() {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const router = useRouter()
    const { sessionData } = useSession();
    const [groupList, setGropuList] = useState<any>([])
    const handleGroupPress = (groupId: string) => {
        router.push({
            pathname: '/(tabs)/group/chatScreen',
            params: { groupId: groupId }
        })
    };
    const groupData = async () => {
        try {
            console.log("kii")
            const response = await fetch("http://192.168.1.26:8080/fetchAllPortOfCompany-mobile", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            const data = await response.json();
            setGropuList(data.ports);
            console.log("datatat-----", data.ports)
        } catch (error) {

        }
    }
    useEffect(() => {
        groupData();
    }, [sessionData])

    const renderGroupItem = (item: any) => (
        <View key={item.id}
            style={styles.groupItem}
        >
            <Image
                source={{
                    uri: item.profile_pic ? `http://192.168.1.26:8080/imageController/${item.profile_pic}.do` : "http://192.168.1.26:8080/resources/img/Profile/default_group_image.png"
                }}
                style={styles.groupImage}
            />
            <View style={styles.groupInfo}>
                <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => handleGroupPress(item.id)}>
                        <Text style={styles.timeText}>{item.status}</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text> */}
            </View>
        </View>
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
                    <Feather name="plus" size={16} color="#000" />
                </TouchableOpacity>
            </View>
            <View>
                {groupList.map((item: any) => (
                    renderGroupItem(item)

                ))}
            </View>

            <CreateGroupModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onCreateGroup={(groupId) => {
                    setIsCreateModalVisible(false);
                    router.push({
                        pathname: '/(tabs)/group',
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#008374',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#fff",
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#000',
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
        alignItems: 'center',
        marginBottom: 4,
    },
    groupName: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeText: {
        fontSize: 14,
        textTransform: 'capitalize',
        padding: 6,
        borderWidth: 1,
        marginRight: 15,
        borderRadius: 7,
        backgroundColor: '#008060',
        color: '#fff',
        borderColor: '#008060',
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