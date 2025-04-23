import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

export default function GroupDetails() {
    const params = useLocalSearchParams();
    const groupName = typeof params.groupName === 'string' ? params.groupName : 'Group Name';
    const groupImage = typeof params.groupImage === 'string' ? params.groupImage : null;
    const data = typeof params.data === 'string' ? params.data : null;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [groupMembers, setGroupMembers] = useState<any>([]);
    console.log("data---", data)

    const friendsList = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`https://www.portstay.com/mobile-port_post_list/${data}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok) {
                if (response.status === 204) {
                } else {
                    const data = await response.json()
                    const groupUser = data.getAllPostOfPort?.map((user: any) => user.postedBy)
                    console.log("dattt----", groupUser)
                    setGroupMembers(groupUser)
                }
            }
        } catch (error) {
            // Alert.alert("Error", "Failed to fetch messages.")
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        friendsList()
    }, [data])
    // const groupMembers = [
    //     { id: 1, name: 'John Doe', role: 'Admin', avatar: null },
    //     { id: 2, name: 'Jane Smith', role: 'Member', avatar: null },
    //     { id: 3, name: 'Mike Johnson', role: 'Member', avatar: null },
    //     { id: 4, name: 'Sarah Wilson', role: 'Member', avatar: null },
    // ];


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#128C7E" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Group Info</Text>
            </View>
            <ScrollView style={styles.scrollContainer}>
                {/* Group Image Section */}
                <View style={styles.imageSection}>
                    {groupImage ? (
                        <Image source={{ uri: groupImage }} style={styles.groupImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>
                                {groupName.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.groupName}>{groupName}</Text>
                    <Text style={styles.memberCount}>{groupMembers.length} members</Text>
                </View>

                {/* Group Members Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Group Members</Text>
                    {groupMembers.map((member: any) => (
                        <View key={member.id} style={styles.memberItem}>
                            {member.avatar ? (
                                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                            ) : (
                                <View style={styles.memberAvatarPlaceholder}>
                                    <Text style={styles.memberAvatarText}>
                                        {member.name.charAt(0)}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberRole}>{member.role}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Group Settings */}
                {/* <View style={styles.section}>
                    <TouchableOpacity style={styles.settingItem}>
                        <Feather name="trash-2" size={24} color="#ef4444" />
                        <Text style={[styles.settingText, styles.dangerText]}>Exit Group</Text>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#128C7E',
        paddingTop: Platform.OS === 'ios' ? 50 : 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    scrollContainer: {
        flex: 1,
    },
    imageSection: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    groupImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePlaceholderText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    groupName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    memberCount: {
        fontSize: 16,
        color: '#6b7280',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    actionButton: {
        alignItems: 'center',
    },
    actionText: {
        marginTop: 8,
        color: '#6366f1',
        fontSize: 14,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    memberAvatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    memberAvatarText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '500',
    },
    memberRole: {
        fontSize: 14,
        color: '#6b7280',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingText: {
        fontSize: 16,
        marginLeft: 16,
        color: '#111827',
    },
    dangerText: {
        color: '#ef4444',
    },
}); 