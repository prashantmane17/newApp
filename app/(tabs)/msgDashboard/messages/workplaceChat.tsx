import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState, useMemo } from "react"
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
} from "react-native"
import { Send, ArrowLeft, MoreVertical } from "lucide-react-native"
import { useSession } from "@/context/ContextSession"
import moment from "moment"

export default function ChatScreen() {
    const { companyId, empId, name } = useLocalSearchParams()
    const router = useRouter()
    const { sessionData } = useSession()
    const [messageUser, setMessageUser] = useState<any>([])
    const [messages, setMessages] = useState<any>([])
    const [userData, setUserData] = useState<any>(null)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const friendsList = async () => {
        try {
            let url = ""
            if (sessionData?.role === "Superadmin") {
                url = `https://www.portstay.com/owner.post.fetch-public-post-mobile?&page=0`
            }
            else {
                url = `https://www.portstay.com/mobile-post.employee.fetch-public-post?companyId=${companyId}&empId=${empId}&page=0`
            }
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            if (response.ok) {
                if (response.status === 204) {
                }
                else {
                    const data = await response.json()
                    // const userMessage = data.posts?.map((user: any) => user.postedUserInfo)
                    // setMessageUser(userMessage || [])
                    setUserData({ name: name || "User", avatar: null })
                    setMessages(data.posts || []);
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch messages.")
        }
    }

    useEffect(() => {
        friendsList()
    }, [companyId])

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
        if (messages.length === 0) return [];

        const groupedMessages: { [key: string]: any[] } = {};

        messages.forEach((msg: any) => {
            const dateKey = moment(msg?.day, "DD MMM YYYY [at] HH:mm").format("YYYY-MM-DD");
            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = [];
            }
            groupedMessages[dateKey].push(msg);
        });

        return Object.keys(groupedMessages)
            .map((date) => ({
                title: formatMessageDate(date),
                data: groupedMessages[date].sort((a, b) =>
                    moment(a.day, "DD MMM YYYY").diff(moment(b.day, "DD MMM YYYY"))
                ),
            }))
            .sort((a, b) =>
                moment(a.data[0].day, "DD MMM YYYY").diff(moment(b.data[0].day, "DD MMM YYYY"))
            );
    }, [messages]);

    const cleanHtml = (html: any) => {
        return html
            .replace(/<p>\s*<br>\s*<\/p>/g, "")
            .replace(/<\/p>\s*<p>/g, "/n")
            .replace(/^\s+|\s+$/g, "")
            .replace(/<br\s*\/?>/g, "/n")
            .replace(/<p\s*\/?>/g, "").replace(/<\/p>/g, "")
            .replace(/<(p|br|div|span|strong|em)>\s*<\/\1>/g, "")
            .replace(/(\s*\n\s*)+/g, " ");
    };
    const HtmlRenderer = (cleanedHtml: string) => {
        const lines = cleanedHtml.split('/n')?.map((line: any, index: number) => (
            <Text key={index}>{line}</Text>
        ));

        return <View>{lines}</View>;
    };

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

                    <Image source={{ uri: userData?.avatar ? userData?.avatar : 'https://www.portstay.com/resources/img/Profile/default_company_image.png' }} style={styles.avatar} />

                    <Text style={styles.userName}>{name || "User"}</Text>
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
            >

                {messages.length > 0 ? (
                    <SectionList
                        sections={messagesByDate}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.messageBubble,
                                    sessionData?.loginId === item.postedBy ? styles.sentMessage : styles.receivedMessage,
                                ]}
                            >
                                <Text style={styles.messagerName}>{item.postedUserInfo.fullName}</Text>
                                {/* <RenderHTML contentWidth={width} source={{ html: cleanHtml(item.post.postDescription) }} /> */}
                                <Text style={styles.messageText}>{HtmlRenderer(cleanHtml(item.postDescription || "--"))}</Text>
                                <Text style={styles.timeText}>{item.date.split('at')[1]}</Text>
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
                )}


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
    messagerName: {
        textTransform: 'capitalize',
        color: 'red',
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




