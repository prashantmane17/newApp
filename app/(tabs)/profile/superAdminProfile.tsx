import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SuperAdminProfile() {
    const [firstName, setFirstName] = useState('Crm');
    const [lastName, setLastName] = useState('Cxo');
    const handleSave = () => {
        console.log("clicked")
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Profile</Text>
                </View>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'http://192.168.1.25:8080/resources/img/Profile/default_user_image.png' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Text style={styles.editAvatarText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.valueContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter first name"
                        placeholderTextColor="#94A3B8"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter last name"
                        placeholderTextColor="#94A3B8"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#06607a',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        marginHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    editAvatarButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    editAvatarText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    valueContainer: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-between',
        marginHorizontal: 30,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 8,
        marginLeft: 7,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 10,
        fontSize: 16,
        color: '#FFFFFF',
        width: 150,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        gap: 12,
        marginBottom: 40,
    },
    saveButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 140,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    saveButtonText: {
        color: '#06607a',
        fontSize: 16,
        fontWeight: '600',
    },
})
