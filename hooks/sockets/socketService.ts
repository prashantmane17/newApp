import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
    message?: string;
    chatId?: string;
    contents: string;
    timestamp?: string;
    dateAndTime: string;
    file?: any;
    fileName?: string;
    fromUserId: string;
    toUserId: string;
    fromUserName?: string;
    fromUserProfilePic?: string | null;
    imageName?: string;
    images?: any;
    msgId?: string;
    type: 'private' | 'group';
}

type MessageCallback = (msg: ChatMessage) => void;

let stompClient: Client | null = null;


export const connectSocket = (channelId: string, onMessageReceived: MessageCallback): void => {
    const socket = new SockJS('http://192.168.1.26:8080/ws');

    stompClient = new Client({
        webSocketFactory: () => socket as WebSocket,
        connectHeaders: {
            login: 'crm@vivo.com',
            passcode: '123456789',
            'accept-version': '1.1,1.0',
            'heart-beat': '10000,10000'
        },
        debug: (str: string) => console.log(str),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('✅ Connected to WebSocket');

            const topic = `/topic/${channelId}.private.chat`;
            stompClient?.subscribe(topic, (message: IMessage) => {
                const body: ChatMessage = JSON.parse(message.body);
                console.log('📩 Message received:');
                onMessageReceived(body);
            });
        },
        onStompError: (frame) => {
            // console.error('❌ STOMP Error:', frame.headers['message']);
        },
    });

    stompClient.activate();
};


export const subscribeToNotifications = (userId: string, onNotificationReceived: any): void => {
    if (!stompClient || !stompClient.connected) {
        console.warn('🔌 WebSocket not connected!');
        return;
    }

    const topic = `/topic/user.notification.${userId}`;
    stompClient.subscribe(topic, (message: IMessage) => {
        const notification = JSON.parse(message.body);
        console.log('🔔 Notification received:', notification);
        onNotificationReceived(notification);
    });
};


export const sendMessage = (channelId: string, messageObj: ChatMessage, fromUserId: string): void => {
    if (!stompClient || !stompClient.connected) {
        console.warn('🔌 WebSocket not connected!');
        return;
    }

    const payload = {
        ...messageObj,
        fromUserId,
    };

    const destination = `/app/${channelId}.private`;

    stompClient.publish({
        destination,
        body: JSON.stringify(payload),
    });

    console.log(`🚀 Message sent to ${destination}`, payload);
};
