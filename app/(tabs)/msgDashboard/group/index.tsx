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
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CreateGroupModal from '@/components/CreateGroupModal';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/ContextSession';

export default function HomeScreen() {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const router = useRouter()
    const { sessionData } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [groupList, setGropuList] = useState<any>([])
    const groupData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://192.168.1.25:8080/fetchAllPortOfCompany-mobile", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            const data = await response.json();
            setGropuList(data.ports);
        } catch (error) {
            Alert.alert("Error", "Failed to load group data")
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        groupData();
    }, [sessionData])

    const handleGroupPress = async (groupId: string, status: string) => {
        if (status == "admin") {
            return;
        }
        setIsLoading(true)
        try {
            let url = ""
            if (status === "message") {
                url = `http://192.168.1.25:8080/port.RequestAction?action=message&portId=${groupId}`
            } else {
                url = `http://192.168.1.25:8080/port.RequestAction?action=leave&portId=${groupId}`
            }
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            if (response.ok) {
                groupData();
                setIsLoading(false)
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load group data")
        } finally {
            setIsLoading(false)
        }
    }
    const renderGroupItem = (item: any) => (
        <View key={item.id}
            style={styles.groupItem}
        >
            <Image
                source={{
                    uri: item.profile_pic ? `http://192.168.1.25:8080/imageController/${item.profile_pic}.do` : "http://192.168.1.25:8080/resources/img/Profile/default_group_image.png"
                }}
                style={styles.groupImage}
            />
            <View style={styles.groupInfo}>
                <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => handleGroupPress(item.id, item.status)}>
                        <Text style={styles.timeText}>{item.status === "message" ? "Add" : item.status === "admin" ? "Admin" : "Remove"}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Group Chats</Text>
                </View>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setIsCreateModalVisible(true)}
                >
                    <Text style={styles.createButtonText}>Create Group</Text>
                    <Feather name="plus" size={16} color="#000" />
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#008374" />
                </View>
            ) : (
                <ScrollView>
                    {groupList.map((item: any) => (
                        renderGroupItem(item)
                    ))}
                </ScrollView>
            )}

            <CreateGroupModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onCreateGroup={(groupId) => {
                    setIsCreateModalVisible(false);
                    router.push({
                        pathname: '/(tabs)/msgDashboard/group',
                    })
                    groupData();
                }
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06607a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
        paddingBottom: 10,
        backgroundColor: '#008374',

    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 7,
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
        margin: 8,
        backgroundColor: '#fff',
    },
    groupImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        objectFit: "contain"
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
        width: 80,
        textAlign: 'center',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
});