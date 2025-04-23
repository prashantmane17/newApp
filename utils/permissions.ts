import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export const requestMediaPermissions = async () => {
    if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return false;
        }
    } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return false;
        }
    }
    return true;
};

export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return false;
    }

    return true;
};

export const requestAllPermissions = async () => {
    const mediaPermission = await requestMediaPermissions();
    const notificationPermission = await requestNotificationPermissions();

    return {
        mediaPermission,
        notificationPermission,
        allGranted: mediaPermission && notificationPermission
    };
}; 