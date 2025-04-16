import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

interface CreateGroupModalProps {
    visible: boolean;
    onClose: () => void;
    onCreateGroup: (groupId: string) => void;
}

export default function CreateGroupModal({
    visible,
    onClose,
    onCreateGroup,
}: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [groupImage, setGroupImage] = useState<string | null>(null);

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setGroupImage(result.assets[0].uri);
        }
    };

    const handleCreateGroup = async () => {
        const formData = new FormData();
        formData.append('port.name', groupName);
        formData.append('imageFile', {
            uri: groupImage!,
            type: 'image/jpeg',
            name: 'portImage.jpg',
        } as any);
        if (!groupName.trim()) return;
        try {
            const response = await fetch('http://192.168.1.26:8080/create_port-mobile', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("ress----", response)
            const result = await response.json();
            console.log("result----", result)

            if (response.ok) {
                Alert.alert('Success', result.message);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
        const newGroupId = `group-${Date.now()}`;
        setGroupName('');
        setGroupImage(null);
        onCreateGroup(newGroupId);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create New Group</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Feather name="x" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formContainer}>
                            <TouchableOpacity
                                style={styles.imagePickerContainer}
                                onPress={handlePickImage}
                            >
                                {groupImage ? (
                                    <Image source={{ uri: groupImage }} style={styles.groupImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Feather name="camera" size={24} color="#6b7280" />
                                    </View>
                                )}
                                <Text style={styles.imagePickerText}>
                                    {groupImage ? 'Change group image' : 'Add group image'}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Group Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={groupName}
                                    onChangeText={setGroupName}
                                    placeholder="Enter group name"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        {/* Button Row */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.createButton,
                                    !groupName.trim() && styles.disabledButton,
                                ]}
                                onPress={handleCreateGroup}
                                disabled={!groupName.trim()}
                            >
                                <Text style={styles.createButtonText}>Create Group</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    formContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePickerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    groupImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        marginBottom: 8,
    },
    imagePickerText: {
        fontSize: 14,
        color: '#6366f1',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 44,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#6b7280',
        fontSize: 14,
        fontWeight: '500',
    },
    createButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#a5b4fc',
    },
    createButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});
