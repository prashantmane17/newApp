import { useRouter } from "expo-router";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";

type SessionData = Record<string, any> | null;

interface SessionContextType {
    sessionData: SessionData;
    getSessionDetails: () => void;
    handleLogout: () => void;
}

const SessionContext = createContext<SessionContextType>({
    sessionData: null,
    getSessionDetails: () => { },
    handleLogout: () => { },
});

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const [sessionData, setSessionData] = useState<SessionData>(null);
    const router = useRouter();

    const getSessionDetails = async () => {
        try {
            const response = await fetch("https://www.portstay.com/session-details", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const text = await response.text();
            try {
                setSessionData(null);
                const data = JSON.parse(text);
                setSessionData(data ?? {});
                if (data.loginId !== null && data.loginId !== undefined && data.loginId !== "") {
                    router.push('/(tabs)/msgDashboard');
                }
                else {
                    // router.replace('/(tabs)/login');
                }
            }
            catch (jsonError) {
                // console.error("JSON Parsing Error:", jsonError);
                // Alert.alert("Error", "Invalid JSON response from the server.");
            }
        } catch (error) {
            // Alert.alert("Error", "Failed to fetch session details. Please try again.");
        }
    };
    const handleLogout = async () => {
        try {
            const response = await fetch('https://www.portstay.com/signout', {
                method: 'GET',
                credentials: 'include', // Important: to include cookies
            });
            if (response.redirected || response.ok) {
                // Optional: You can also navigate to lo/gin screen or show a message
                setSessionData(null);
                // Alert.alert('Logged out successfully');
                router.replace('/(tabs)'); // assuming you're using React Navigation
            } else {
                Alert.alert('Logout failed');
            }
        } catch (error) {
            // console.error('Logout error:', error);/
            Alert.alert('An error occurred during logout');
        }
    };

    useEffect(() => {
        getSessionDetails();
    }, []);

    return (
        <SessionContext.Provider value={{ sessionData, getSessionDetails, handleLogout }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom Hook for Using Context
export const useSession = () => {
    return useContext(SessionContext);
};
