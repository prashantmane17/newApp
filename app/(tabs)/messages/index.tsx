import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/context/ContextSession';

export default function MessagesScreen() {
    const router = useRouter();
    const { sessionData } = useSession();
    const [messagesUser, setMessagesUser] = useState<any>([]);

    const friendsList = async (id: string) => {
        try {
            const response = await fetch(`http://192.168.1.26:8080/employee.cover-profile-mobile${id}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setMessagesUser(data.friends);
        } catch (error) {
            Alert.alert("Error", "Failed to load contacts.");
        }
    };
    const makeFriend = async (id: string, status: string) => {
        try {
            let response;
            if (status === "Message") {
                response = await fetch(`http://192.168.1.26:8080/add-friend?id=${id}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }

                })
            }
            else {
                response = await fetch(`http://192.168.1.26:8080/friendRequestAction.do?frndRequestAction=Unfollow&&userId=${id}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }

                })
            }
            if (response.ok) {
                if (status === "Message") {
                    router.push("/(tabs)")
                }
                friendsList(sessionData?.loginId);
            }
            else {
                console.log("not good")
            }
        } catch (error) {
            console.log("jiioo--")
        }
    }

    useEffect(() => {
        if (sessionData?.loginId) {
            friendsList(sessionData.loginId);
        }
    }, [sessionData]);

    return (
        <View style={styles.container}>
            {/* Top Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Peoples</Text>
            </View>

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

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 60,
        backgroundColor: '#008374',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
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
        color: '#111',
        textTransform: 'capitalize',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
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
});
