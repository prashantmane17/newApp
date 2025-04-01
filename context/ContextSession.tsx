import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";

const SessionContext = createContext({
    session: null,
    getSessionDetails: () => { }
});
interface SessionProviderProps {
    children: ReactNode;
}
export const SessionProvider = ({ children }: SessionProviderProps) => {
    const [session, setSession] = useState(null);

    const getSessionDetails = async () => {
        try {
            const response = await fetch("http://192.168.1.26:8080/session-details", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setSession(data);
            console.log("Session Data:", data);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch session details.");
        }
    };

    useEffect(() => {
        getSessionDetails();
    }, []);

    return (
        <SessionContext.Provider value={{ session, getSessionDetails }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom Hook for Using Context
export const useSession = () => {
    return useContext(SessionContext);
};
