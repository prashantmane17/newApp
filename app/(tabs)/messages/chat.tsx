


import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState, useMemo, useRef } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SectionList,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StatusBar,
    Image,
    Keyboard,
    ScrollView,
    ActivityIndicator
} from "react-native"
import { Send, ArrowLeft, MoreVertical } from "lucide-react-native"
import { useSession } from "@/context/ContextSession"
import moment from "moment"
import { connectSocket, sendMessage as sendSocketMessage, ChatMessage } from '@/hooks/sockets/socketService'; // adjust the path as per your project structure
import { subscribeToNotifications } from '@/hooks/sockets/socketService'; // adjust the path as per your project structure


export default function ChatScreen() {
    const { id, name } = useLocalSearchParams()
    const router = useRouter()
    const { sessionData } = useSession()
    console.log(name, "id----", id)
    const [channelId, setChannelId] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const sectionListRef = useRef<SectionList<any>>(null);
    const [messages, setMessages] = useState<any>([])
    const [userData, setUserData] = useState<any>(null)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const friendsList = async () => {
        setIsLoading(true);
        try {
            let url = "http://192.168.1.26:8080/employee.chatUsers-mobile"
            if (sessionData?.role === "Superadmin") {
                url = "http://192.168.1.26:8080/superadmin.chatUsers-Mobile"
            }
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            const chatResponse = await fetch(`http://192.168.1.26:8080/api/private-chat/mobile-establishchannel/${sessionData?.loginId}/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()
            console.log("dhuu----", data);
            const userMessage = data.friendList || data.superadminList.find((user: any) => id === user.id)
            const branchMessage = data.branchList.find((branch: any) => id === branch.id)
            const chatdata = await chatResponse.json();
            console.log("data----", chatdata);
            console.log("ress----", chatdata.chatChannelList[0].uuid)
            setChannelId(chatdata.chatChannelList[0].uuid);
            setUserData(userMessage || branchMessage || name || { name: "User", avatar: null })
            setMessages(userMessage?.message || branchMessage?.message || [])
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error", "Failed to fetch messages.")
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!id || !sessionData?.loginId) return;
        friendsList();
        if (channelId) {

            connectSocket(channelId, (newMessage: ChatMessage) => {
                setMessages((prevMessages: any) => [
                    ...prevMessages,
                    {
                        id: prevMessages.length + 1,
                        contents: newMessage.contents,
                        authorUser: { id: newMessage.fromUserId },
                        timeSent: newMessage.dateAndTime,
                    },
                ]);
                subscribeToNotifications(sessionData?.loginId, (notification: any) => {
                    Alert.alert(`🔔 New Notification: ${notification.contents}`);
                });
                // console.log("newMessage----", newMessage)
            });

        }
    }, [id, channelId]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage: ChatMessage = {
                dateAndTime: new Date().toISOString(),
                chatId: "d",
                fromUserId: sessionData?.loginId,
                contents: message as string,
                fromUserName: 'Hremp L',
                fromUserProfilePic: null,
                toUserId: id as string,
                type: 'private'

            };
            sendSocketMessage(channelId, newMessage, sessionData?.loginId);

            setMessage("");
        }
    };


    const formatMessageDate = (dateString: string) => {
        const date = moment(dateString)
        const today = moment().startOf("day")
        const yesterday = moment().subtract(1, "day").startOf("day")

        if (date.isSame(today, "day")) return "Today"
        if (date.isSame(yesterday, "day")) return "Yesterday"
        return date.format("DD MMMM YYYY")
    }

    const formatTime = (dateString: string) => moment(dateString).format("hh:mm A")

    // Group messages by date for SectionList
    const messagesByDate = useMemo(() => {
        if (messages.length === 0) return []

        const groupedMessages: { [key: string]: any[] } = {}

        messages?.forEach((msg: any) => {
            const dateKey = moment(msg.timeSent).format("YYYY-MM-DD")
            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = []
            }
            groupedMessages[dateKey].push(msg)
        })

        return Object.keys(groupedMessages)
            .map((date) => ({
                title: formatMessageDate(date),
                data: groupedMessages[date],
            }))
            .sort((a, b) => {
                return moment(b.data[0].timeSent).isBefore(moment(a.data[0].timeSent)) ? 1 : -1
            })
    }, [messages])

    const EmptyChat = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>
                <Text style={styles.emptyIcon}>💬</Text>
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>Start the conversation by sending a message below</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#128C7E" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <ArrowLeft color="#FFFFFF" size={24} />
                </TouchableOpacity>

                <View style={styles.userInfo}>
                    {userData?.avatar ? (
                        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{userData?.name?.charAt(0) || name?.charAt(0) || "U"}</Text>
                        </View>
                    )}
                    <Text style={styles.userName}>{userData?.name || name || "User"}</Text>
                </View>

                <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                    <MoreVertical color="#FFFFFF" size={24} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[
                    styles.chatContainer,
                    isKeyboardVisible && styles.keyboardOpenStyle // Apply different styles
                ]}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >{!isLoading ? (
                messages.length > 0 ? (
                    <SectionList
                        ref={sectionListRef}
                        sections={messagesByDate}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.messageBubble,
                                    sessionData?.loginId === item.authorUser?.id ? styles.sentMessage : styles.receivedMessage,
                                ]}
                            >
                                <Text style={styles.messageText}>{item.contents}</Text>
                                <Text style={styles.timeText}>{formatTime(item.timeSent)}</Text>
                            </View>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.dateSeparator}>
                                <Text style={styles.dateText}>{title}</Text>
                            </View>
                        )}
                        stickySectionHeadersEnabled={true}
                        contentContainerStyle={styles.listContent}
                        inverted={false}
                    />
                ) : (
                    <EmptyChat />
                )

            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#008374" />
                </View>
            )}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message..."
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                        activeOpacity={0.7}
                        disabled={!message.trim()}
                    >
                        <Send color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5DDD5",
        // paddingBottom: 20,// WhatsApp chat background color
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#128C7E", // WhatsApp header green
        paddingTop: Platform.OS === "ios" ? 50 : 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    backButton: {
        padding: 5,
    },
    userInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#25D366",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    userName: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        textTransform: "capitalize",
        width: 200,
    },
    moreButton: {
        padding: 5,
    },
    chatContainer: {
        flex: 1,
    },
    keyboardOpenStyle: {
        paddingBottom: 30,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 10,
    },
    dateSeparator: {
        alignSelf: "center",
        backgroundColor: "#E1F3FB",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    dateText: {
        fontSize: 12,
        color: "#4A4A4A",
        fontWeight: "600",
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 8,
        borderRadius: 8,
        marginVertical: 2,
    },
    sentMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6", // WhatsApp green bubble
        borderBottomRightRadius: 0,
    },
    receivedMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 0,
    },
    messageText: {
        fontSize: 16,
        color: "#303030",
        lineHeight: 22,
    },
    timeText: {
        fontSize: 11,
        color: "#7D7D7D",
        textAlign: "right",
        marginTop: 2,
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#F6F6F6",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    input: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    sendButton: {
        backgroundColor: "#00A884", // WhatsApp green
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4A4A4A",
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#7D7D7D",
        textAlign: "center",
    },
})




