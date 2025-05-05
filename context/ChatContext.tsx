import { useRouter } from "expo-router";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Alert } from "react-native";

// Type for chat session data
type ChatData = Record<string, any> | null;

// Context type interface
interface ChatContextType {
    chatData: ChatData;
    getChatDetails: () => void;
}

// Default context value
const ChatContext = createContext<ChatContextType>({
    chatData: null,
    getChatDetails: () => { },
});

// Props type for provider
interface ChatProviderProps {
    children: ReactNode;
}

// Provider component
export const SessionProvider = ({ children }: ChatProviderProps) => {
    const [chatData, setChatData] = useState<ChatData>(null);
    const router = useRouter();

    const getChatDetails = async () => {
        try {
            const response = await fetch('http://192.168.1.25:8080/employee.chatUsers-mobile', {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            }); try {
                const data = await response.json();
                setChatData(data);
            } catch (jsonError) {
                console.error("JSON Parsing Error:", jsonError);
                Alert.alert("Error", "Invalid JSON response from the server.");
            }
        } catch (error) {
            console.error("Network Error:", error);
            Alert.alert("Error", "Failed to fetch session details. Please try again.");
        }
    };

    useEffect(() => {
        getChatDetails();
    }, []);

    return (
        <ChatContext.Provider value={{ chatData, getChatDetails }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to access ChatContext
export const useChat = () => useContext(ChatContext);
