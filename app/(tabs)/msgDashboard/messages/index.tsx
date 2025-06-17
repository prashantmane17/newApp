import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/context/ContextSession';
import { Feather } from '@expo/vector-icons';

export default function MessagesScreen() {
    const router = useRouter();
    const { sessionData } = useSession();
    const [messagesUser, setMessagesUser] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);

    const friendsList = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://www.portstay.com/employee.cover-profile-mobile${id}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setMessagesUser(data.friends);
        } catch (error) {
            Alert.alert("Error", "Failed to load contacts.");
        } finally {
            setIsLoading(false);
        }
    };
    const makeFriend = async (id: string, status: string) => {
        try {
            let response;
            if (status === "Message") {
                response = await fetch(`https://www.portstay.com/add-friend?id=${id}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }

                })
            }
            else {
                response = await fetch(`https://www.portstay.com/friendRequestAction.do?frndRequestAction=Unfollow&&userId=${id}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }

                })
            }
            if (response.ok) {
                if (status === "Message") {
                    router.push("/(tabs)/msgDashboard")
                }

                friendsList(sessionData?.userId);
            }
            else {
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        if (sessionData?.loginId) {
            friendsList(sessionData.userId);
        }
    }, [sessionData]);

    return (
        <View style={styles.container}>
            {/* Top Header */}
            <View style={styles.header}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Peoples</Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#008374" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    {messagesUser.map((contact: any) => {
                        if (contact.userId === sessionData?.loginId) return null;

                        return (
                            <View
                                key={contact.userId}
                                style={styles.contactItem}
                            >
                                <Image
                                    source={{
                                        uri: contact.profile_pic
                                            ? contact.profile_pic
                                            : 'https://www.portstay.com/resources/img/Profile/default_user_image.png',
                                    }}
                                    style={styles.avatar}
                                />
                                <View style={styles.contactInfo}>
                                    <Text style={styles.name}>{contact.name}</Text>
                                    <Text style={styles.lastMessage}>{contact.email}</Text>
                                </View>
                                <TouchableOpacity style={styles.msgStatusContainer} onPress={() => makeFriend(contact.userId, contact.status)}>
                                    <Text style={styles.msgStatus}>{contact.status === "Message" ? "Add" : "Remove"}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06607a',
    },
    header: {
        height: 60,
        backgroundColor: '#008374',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContainer: {
        paddingBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#ccc',
    },
    contactInfo: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'capitalize',
    },
    lastMessage: {
        fontSize: 14,
        color: '#f5f5f5',
        marginTop: 2,
    },
    msgStatusContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#008060',
        borderRadius: 12,
    },
    msgStatus: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        width: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
});
