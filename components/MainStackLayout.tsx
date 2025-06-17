import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Keyboard } from 'react-native';
import { SessionProvider, useSession } from '@/context/ContextSession';
import { useRouter, usePathname } from 'expo-router';
import { MessageSquare, DollarSign, Settings, User, LogOut, TicketPlus, Landmark } from 'lucide-react-native';

type RouteType = '/(tabs)/msgDashboard' | '/(tabs)/payroll' | '/(tabs)/settings' | '/(tabs)/profile' | '/(tabs)/logout';

export function MainStackLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const pathname = usePathname();
    const { sessionData, getSessionDetails, handleLogout } = useSession();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (sessionData === null) {
            getSessionDetails();
        }
    }, [sessionData]);

    const navigationItems: { name: string; route: RouteType; icon: React.ReactNode; role: string }[] = [
        {
            name: 'Message',
            route: '/(tabs)/msgDashboard',
            icon: <MessageSquare size={24} />,
            role: "all",
        },
        {
            name: 'Payroll',
            route: '/(tabs)/payslip',
            icon: <Landmark size={24} />,
            role: sessionData?.role,
        },
        {
            name: 'Attendance',
            route: '/(tabs)/attendance',
            icon: <User size={24} />,
            role: sessionData?.role,
        },
        {
            name: 'Settings',
            route: '/(tabs)/profile',
            icon: <Settings size={24} />,
            role: sessionData?.role,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={(pathname === '/' || isKeyboardVisible) ? styles.content : styles.screenContent}>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: Colors[colorScheme ?? 'light'].background,
                        },
                        headerTintColor: Colors[colorScheme ?? 'light'].text,
                    }}
                >
                    <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
                    <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
                    <Stack.Screen name="msgDashboard" options={{ title: 'Explore', headerShown: false }} />
                    <Stack.Screen name="payslip" options={{ title: 'Payslip', headerShown: false }} />
                    <Stack.Screen name="attendance" options={{ title: 'Attendance', headerShown: false }} />
                    <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
                </Stack>
            </View>

            {pathname !== '/' && !isKeyboardVisible && (
                <View style={styles.bottomNav}>
                    {navigationItems.map((item) => (
                        item.role !== "Superadmin" && (
                            <TouchableOpacity
                                key={item.name}
                                style={[
                                    styles.navItem,
                                    item.route.includes(pathname) ? styles.activeItem : null
                                ]}
                                onPress={() => router.push(item.route as any)}
                            >

                                {React.cloneElement(item.icon as React.ReactElement, {
                                    color: "white"
                                })}
                                <Text style={styles.navText}>{item.name}</Text>
                            </TouchableOpacity>
                        )))}
                    {sessionData?.role === 'Superadmin' && (
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => router.push('/(tabs)/profile/superAdminProfile')}
                        >
                            <Settings size={24} color="#ffffff" />
                            <Text style={styles.navText}>Admin</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={handleLogout}
                    >
                        <LogOut size={24} color="#ffffff" />
                        <Text style={styles.navText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        backgroundColor: "white",
        // paddingBottom: 60,
    },
    screenContent: {
        flex: 1,
        paddingBottom: 60,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#6eb7cd',

        backgroundColor: '#06607a',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },
    activeItem: {
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#6eb7cd',
        borderRadius: 20,
        transitionDuration: '0.3s',
        transitionProperty: 'border-bottom-width',
        transitionTimingFunction: 'ease',
        position: 'relative',
    },

    navText: {
        fontSize: 12,
        marginTop: 4,
        color: 'white',
    },
});
