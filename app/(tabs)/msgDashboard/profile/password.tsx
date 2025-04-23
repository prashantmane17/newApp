import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons

export default function ChangePasswordScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = () => {
        // Implement your save logic here

        // Example validation
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        // Call API to change password
        alert('Password changed successfully');
    };

    const handleClose = () => {
        // Implement your close logic here
        // You would typically navigate back or close a modal here
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.card}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Change Password</Text>
                        <View style={styles.purpleLine}></View>
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

                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
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
        backgroundColor: '#F8F5FF', // Light purple background
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
        shadowColor: '#6A3EA1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    headerContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4F46E5', // Purple color for title
        marginBottom: 8,
    },
    purpleLine: {
        height: 3,
        width: 60,
        backgroundColor: '#9D6FDE',
        borderRadius: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#696868', // Purple color for labels
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2D9F3', // Light purple border
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
        backgroundColor: '#4F46E5', // Purple save button
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        shadowColor: '#6A3EA1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
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
        borderColor: '#4F46E5', // Purple border
        flex: 1,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#4F46E5', // Purple text
        fontSize: 16,
        fontWeight: '600',
    },
});