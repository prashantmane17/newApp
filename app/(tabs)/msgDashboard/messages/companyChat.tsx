"use client"

import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState, useMemo, useRef } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, KeyboardAvoidingView, Platform, Alert, StatusBar, Image, Keyboard, ActivityIndicator, ToastAndroid, SectionListRenderItem } from "react-native"
import { Send, ArrowLeft, MoreVertical, Download, ArrowUp } from "lucide-react-native"
import { useSession } from "@/context/ContextSession"
import moment from "moment"
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"

export default function ChatScreen() {
    const { id, name, avatar } = useLocalSearchParams()
    const router = useRouter()
    const { sessionData } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<any>([])
    const [images, setImages] = useState<any>([])
    const [userData, setUserData] = useState<any>(null)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false)
    const [downloadingImages, setDownloadingImages] = useState<{ [key: string]: boolean }>({})
    const [showScrollTop, setShowScrollTop] = useState(false)
    const sectionListRef = useRef<SectionList>(null)

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Show button if scrolled more than 300 pixels
        setShowScrollTop(offsetY > 300);
    };

    const scrollToTop = () => {
        sectionListRef.current?.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            animated: true,
        });
    };

    const friendsList = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`https://www.portstay.com/mobile-port_post_list/${id}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok) {
                if (response.status === 204) {
                } else {
                    const data = await response.json()
                    const userMessage = data.getAllPostOfPort?.map((user: any) => user.post.images)
                    setUserData({ name: name, avatar: null })
                    setImages(userMessage)
                    setMessages(data.getAllPostOfPort || [])
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
    }, [id])
    const requestPermission = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        return status === "granted"
    }

    const downloadImage = async (imageUrl: string, imageName: string) => {
        setDownloadingImages((prev) => ({ ...prev, [imageName]: true }))

        try {
            const permissionGranted = await requestPermission()
            if (!permissionGranted) {
                setDownloadingImages((prev) => ({ ...prev, [imageName]: false }))
                return
            }

            const timestamp = new Date().getTime()
            const filename = imageName ? `${imageName}_${timestamp}.jpg` : `image_${timestamp}.jpg`
            const fileUri = FileSystem.documentDirectory + filename

            const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri)

            if (downloadResult.status !== 200) {
                throw new Error("Failed to download file")
            }

            const asset = await MediaLibrary.createAssetAsync(downloadResult.uri)
            await MediaLibrary.createAlbumAsync("Downloads", asset, false)

            if (Platform.OS === "android") {
                ToastAndroid.show("Image saved to Downloads", ToastAndroid.SHORT)
            } else {
                Alert.alert("Success", "Image saved to Downloads")
            }

            return downloadResult.uri
        } catch (error) {
            console.error("Download error:", error)
            Alert.alert("Error", "Failed to download the image.")
        } finally {
            setDownloadingImages((prev) => ({ ...prev, [imageName]: false }))
        }
    }

    const formatMessageDate = (dateString: string) => {
        const date = moment(dateString, ["DD MMM YYYY ", "YYYY-MM-DD"])
        const now = moment()
        // const diffMinutes = now.diff(date, 'minutes')
        // const diffHours = now.diff(date, 'hours')
        const diffDays = now.startOf('day').diff(date.startOf('day'), 'days')

        if (diffDays === 0) {

            return "Today"
        }
        if (diffDays === 1) {
            return "Yesterday"
        }
        return date.format("DD MMM YYYY")
    }
    const convertAgoToDate = (text: string) => {
        const [valueStr, rawUnit] = text.split(' ');
        const value = parseInt(valueStr);

        let unit: moment.unitOfTime.DurationConstructor;

        if (rawUnit.toLowerCase().startsWith('hr')) {
            unit = 'hours';
        } else if (rawUnit.toLowerCase().startsWith('min')) {
            unit = 'minutes';
        } else {
            throw new Error('Unsupported time unit');
        }
        const dateTime = moment().subtract(value, unit);
        return dateTime.format('YYYY-MM-DD HH:mm:ss');
    };
    const yesterdayDate = (input: string): string => {
        if (!input.includes("Yesterday")) return "hi";

        const timePart = input.replace("Yesterday at", "").trim(); // e.g., "13:48"
        const [hourStr, minuteStr] = timePart.split(":");

        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(hour, minute, 0, 0);
        // Format as YYYY-MM-DD HH:mm:ss
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${yesterday.getFullYear()}-${pad(yesterday.getMonth() + 1)}-${pad(yesterday.getDate())} ${pad(yesterday.getHours())}:${pad(yesterday.getMinutes())}:${pad(yesterday.getSeconds())}`;
    };


    const messagesByDate = useMemo(() => {
        if (messages.length === 0) return []

        const groupedMessages: { [key: string]: any[] } = {}

        messages.forEach((msg: any) => {
            // Parse the date consistently whether it's relative or absolute
            if (!msg.post?.date) return; // Skip messages without dates


            // Parse the date consistently whether it's relative or absolute
            if (msg.post.date.includes('Yesterday')) {
                msg.post.date = yesterdayDate(msg.post.date)
            }
            else if (typeof msg.post.date === 'string') {
                if (msg.post.date.includes('ago'))
                    msg.post.date = convertAgoToDate(msg.post.date)
            }


            const msgDate = moment(msg.post.date, ["DD MMM YYYY [at] HH:mm", "YYYY-MM-DD HH:mm:ss"])
            const dateKey = msgDate.format("YYYY-MM-DD")
            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = []
            }
            groupedMessages[dateKey].push(msg)
        })

        return Object.keys(groupedMessages)
            .map((date) => ({
                title: formatMessageDate(date),
                data: groupedMessages[date].sort((a, b) => {
                    const dateA = moment(a.post.date, ["DD MMM YYYY [at] HH:mm", "YYYY-MM-DD HH:mm:ss"])
                    const dateB = moment(b.post.date, ["DD MMM YYYY [at] HH:mm", "YYYY-MM-DD HH:mm:ss"])
                    return dateB.diff(dateA)
                }),
            }))
            .sort((a, b) => {
                const dateA = moment(a.data[0].post.date, ["DD MMM YYYY [at] HH:mm", "YYYY-MM-DD HH:mm:ss"])
                const dateB = moment(b.data[0].post.date, ["DD MMM YYYY [at] HH:mm", "YYYY-MM-DD HH:mm:ss"])
                return dateB.diff(dateA) // Sort in descending order (newest first)
            })
    }, [messages])


    const cleanHtml = (html: any) => {
        return html
            .replace(/<p>\s*<br>\s*<\/p>/g, "")
            .replace(/^\s+|\s+$/g, "")
            .replace(/<br\s*\/?>/g, "/n")
            .replace(/<p\s*\/?>/g, "")
            .replace(/<\/p>/g, "")
            .replace(/<(p|br|div|span|strong|em)>\s*<\/\1>/g, "")
            .replace(/(\s*\n\s*)+/g, " ")
    }

    const HtmlRenderer = (cleanedHtml: string) => {
        const [expanded, setExpanded] = useState(false);
        const text = cleanedHtml.replace(/\/n/g, ' ');
        const shouldShowReadMore = text.length > 450;
        const displayText = expanded ? text : text.slice(0, 450);

        return (
            <View>
                <Text style={styles.messageText}>{displayText}</Text>
                {shouldShowReadMore && (
                    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                        <Text style={styles.readMoreText}>
                            {expanded ? 'Read Less' : 'Read More'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
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

    const ImageWithDownload = ({ imageUrl, imageName }: { imageUrl: string; imageName: string }) => {
        const isDownloading = downloadingImages[imageName] || false

        return (
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadImage(imageUrl, imageName)}
                    disabled={isDownloading}
                >
                    {isDownloading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Download color="#FFFFFF" size={16} />}
                </TouchableOpacity>
            </View>
        )
    }

    const sendMessage = async () => {
        if (message.trim()) {
            try {
                const response = await fetch('https://www.portstay.com/add-port-post-mobile', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postDescription: message,
                        imgName: '',
                        counterName: '',
                        description: '',
                        postedOn: id
                    }),
                });

                if (response.ok) {
                    const newPost = await response.json();
                    const newMessage = {
                        post: {
                            id: newPost.id,
                            postDescription: newPost.postDescription,
                            postedBy: { id: sessionData?.loginId },
                            date: moment().format("DD MMM YYYY [at] HH:mm"),
                            images: newPost.images
                        },
                        postedBy: {
                            id: sessionData?.loginId,
                            fullName: sessionData?.name,
                        }
                    };
                    setMessages((prevMessages: any[]) => [...prevMessages, newMessage]);
                    setMessage("");
                    // Scroll to top after sending message
                    setTimeout(() => {
                        scrollToTop();
                    }, 100);
                } else {
                    Alert.alert("Error", "Failed to send message");
                }
            } catch (error) {
                console.error("Error sending message:", error);
                Alert.alert("Error", "Failed to send message");
            }
        }
    };
    const FormateDate = (date: string) => {
        if (date.includes('at')) {
            const timePart = date.split("at")[1].trim()
            return moment(timePart, "HH:mm").format("h:mm A")
        }
        return moment(date).format("h:mm A")
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#128C7E" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <ArrowLeft color="#FFFFFF" size={24} />
                </TouchableOpacity>

                <View style={styles.userInfo}>
                    <TouchableOpacity
                        style={styles.userInfoTouchable}
                        onPress={() => router.push({
                            pathname: '/(tabs)/msgDashboard/group/groupDetails',
                            params: {
                                groupName: userData?.name || "User",
                                groupImage: userData?.avatar || null
                            }
                        })}
                    >

                        <Image source={{ uri: avatar as string }} style={styles.avatar} />

                        <Text style={styles.userName}>{name || "User"}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                    <MoreVertical color="#FFFFFF" size={24} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[
                    styles.chatContainer,
                    isKeyboardVisible && styles.keyboardOpenStyle, // Apply different styles
                ]}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
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
                        onPress={sendMessage}
                        activeOpacity={0.7}
                        disabled={!message.trim()}
                    >
                        <Send color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#128C7E" />
                        <Text style={styles.loadingText}>Loading messages...</Text>
                    </View>
                ) : messages.length > 0 ? (
                    <SectionList
                        ref={sectionListRef}
                        sections={messagesByDate}
                        keyExtractor={(item) => item.post?.id?.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.msgContainer}>
                                    <View>
                                        <Image source={{
                                            uri: item.postedBy.profile_pic ? `https://www.portstay.com/imageController/${item.postedBy.profile_pic}.do` : "https://www.portstay.com/resources/img/Profile/default_user_image.png"
                                        }} style={styles.msgAvatar} />
                                    </View>

                                    <View
                                        style={[
                                            styles.messageBubble, styles.receivedMessage,
                                            // sessionData?.loginId === item.post?.postedBy ? styles.sentMessage : styles.receivedMessage,
                                        ]}
                                    >
                                        <Text style={styles.messagerName}>{item.postedBy.fullName}</Text>
                                        {item.post?.images && (
                                            <ImageWithDownload
                                                imageUrl={`https://www.portstay.com/imageController/${item.post?.images?.imageNames}.do`}
                                                imageName={item.post?.images?.imageNames} />
                                        )}
                                        <Text style={styles.messageText}>{HtmlRenderer(cleanHtml(item.post.postDescription || "--"))}</Text>
                                        <Text style={styles.timeText}>{FormateDate(item.post?.date)}</Text>
                                    </View>
                                </View>
                            )
                        }}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.dateSeparator}>
                                <Text style={styles.dateText}>{title}</Text>
                            </View>
                        )}
                        stickySectionHeadersEnabled={true}
                        contentContainerStyle={styles.listContent}
                        inverted={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />
                ) : (
                    <EmptyChat />
                )}
            </KeyboardAvoidingView>
            {showScrollTop && (
                <TouchableOpacity
                    style={styles.scrollTopButton}
                    onPress={scrollToTop}
                    activeOpacity={0.7}
                >
                    <ArrowUp color="#FFFFFF" size={24} />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5DDD5",
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
    msgContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 2,
        gap: 10,
    },
    msgAvatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
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
        textTransform: "capitalize",
        color: "red",
    },
    imageContainer: {
        position: "relative",
        marginVertical: 5,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    downloadButton: {
        position: "absolute",
        right: 10,
        bottom: 10,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    messageText: {
        fontSize: 16,
        color: '#303030',
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
    scrollTopButton: {
        position: 'absolute',
        right: 20,
        bottom: 100,
        backgroundColor: '#128C7E',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    readMoreText: {
        color: '#6366f1',
        fontSize: 14,
        marginTop: 4,
    },
    userInfoTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5DDD5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#128C7E',
        fontWeight: '500',
    },
})
