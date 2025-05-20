import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ChangePasswordScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        const formBody = new URLSearchParams({
            old_password: oldPassword,
            new_password: newPassword,
            repeat_password: confirmPassword
        }).toString();

        try {
            const response = await fetch('https://www.portstay.com/password-setting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody,
                credentials: 'include',
            });

            const result = await response.json();
            console.log("Server Response:", result);

            if (result.validated) {
                setOldPassword('')
                setNewPassword("")
                setConfirmPassword('')
                Alert.alert('Success', 'Password changed successfully!');
            } else {
                Alert.alert('Error', 'Password change failed.');
            }
        } catch (error) {
            // console.error('Error:', error);
            // Alert.alert('Error', 'Something went wrong.');
        }

        // Call API to change password
        // alert('Password changed successfully');
    };

    const handleClose = () => {
        // Implement your close logic here
        // You would typically navigate back or close a modal here
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#06607a" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.card}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Change Password</Text>
                        <View style={styles.accentLine}></View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Old Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showOldPassword}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                placeholder="Enter your current password"
                                placeholderTextColor="#9E9E9E"
                            />
                            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showOldPassword ? "eye-off" : "eye"} size={22} color="#adadad" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showNewPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter your new password"
                                placeholderTextColor="#9E9E9E"
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={22} color="#adadad" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your new password"
                                placeholderTextColor="#9E9E9E"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#adadad" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                            <Text style={styles.closeButtonText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06607a', // Changed to requested teal/blue color
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    headerContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#06607a', // Changed to match background
        marginBottom: 8,
    },
    accentLine: {
        height: 3,
        width: 60,
        backgroundColor: '#06607a', // Changed to match background
        borderRadius: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555555', // Darkened for better contrast
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E0E0E0', // Neutral border color
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        color: '#333333',
    },
    eyeIcon: {
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 24,
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#06607a', // Changed to match background
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#06607a', // Changed to match background
        flex: 1,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#06607a', // Changed to match background
        fontSize: 16,
        fontWeight: '600',
    },
});