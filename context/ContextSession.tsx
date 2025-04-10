import { useRouter } from "expo-router";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";

type SessionData = Record<string, any> | null;

interface SessionContextType {
    sessionData: SessionData;
    getSessionDetails: () => void;
}

const SessionContext = createContext<SessionContextType>({
    sessionData: null,
    getSessionDetails: () => { },
});

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const [sessionData, setSessionData] = useState<SessionData>(null);
    const router = useRouter();

    const getSessionDetails = async () => {
        try {
            const response = await fetch("http://192.168.1.26:8080/session-details", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                setSessionData(data ?? {});
                router.push('/(tabs)')
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
        getSessionDetails();
    }, []);

    return (
        <SessionContext.Provider value={{ sessionData, getSessionDetails }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom Hook for Using Context
export const useSession = () => {
    return useContext(SessionContext);
};
