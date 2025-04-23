import { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { usePathname } from 'expo-router';

export const useDoubleTapToExit = (exitHandler: () => void) => {
    const pathname = usePathname();
    const backPressCount = useRef(0);
    const backPressTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const backAction = () => {
            // Check if we're on the login or dashboard screen
            // console.log("pathname----", pathname);
            const isLoginOrDashboard = pathname === '/' || pathname === '/msgDashboard';

            if (!isLoginOrDashboard) {
                return false;
            }

            if (backPressCount.current === 0) {
                backPressCount.current = 1;
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                }
                backPressTimer.current = setTimeout(() => {
                    backPressCount.current = 0;
                }, 2000);
                return true;
            } else {
                backPressCount.current = 0;
                if (backPressTimer.current) {
                    clearTimeout(backPressTimer.current);
                }
                exitHandler();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
            if (backPressTimer.current) {
                clearTimeout(backPressTimer.current);
            }
        };
    }, [exitHandler, pathname]);
};
