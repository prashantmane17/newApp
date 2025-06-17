"use client"

import { useEffect, useState } from "react"
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useSession } from "@/context/ContextSession"

export default function SuperAdminProfile() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [profileImage, setProfileImage] = useState<string>("")
    const [profilePic, setProfilePic] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const { sessionData } = useSession()
    // console.log("sss---", sessionData)

    const loadSalary = async () => {
        setLoading(true);
        const response = await fetch(`https://www.portstay.com/owner-setting-mobile${sessionData?.userId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json()
            console.log("jijojs---", data)
            setFirstName(data.owner.firstName)
            setLastName(data.owner.lastName)
            setProfilePic(data.owner.profile_pic)
        }
        setLoading(false);
    }

    useEffect(() => {
        loadSalary();
    }, []);

    const convertImageToBase64 = async (uri: string) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            })

            // Optional: Add prefix (required by backend to detect MIME type)
            const ext = uri.split(".").pop() // jpg, png, etc.
            const mimeType = ext === "png" ? "image/png" : "image/jpeg"

            return `data:${mimeType};base64,${base64}`
        } catch (error) {
            console.error("Error converting image to base64:", error)
            return null
        }
    }

    // const pickImage = async () => {
    //     // Request permission first
    //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    //     if (status !== "granted") {
    //         Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!")
    //         return
    //     }

    //     try {
    //         // Launch image library without cropping
    //         const result = await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //             allowsEditing: false, // Set to false to prevent cropping
    //             quality: 1,
    //             base64: false, // We'll convert manually for more control
    //         })

    //         if (!result.canceled && result.assets && result.assets.length > 0) {
    //             const selectedImage = result.assets[0]
    //             console.log("Selected image:", selectedImage.uri)
    //             setProfileImage(selectedImage.uri)
    //         }
    //     } catch (error) {
    //         console.error("Error picking image:", error)
    //         Alert.alert("Error", "Failed to pick image")
    //     }
    // }
    const pickImage = async () => {
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
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        console.log("clicked")
        try {
            setLoading(true)

            let base64Image = null
            if (profileImage) {
                base64Image = await convertImageToBase64(profileImage)
            }

            const response = await fetch("https://www.portstay.com/owner-updateSuperadmin-mobile", {
                method: "POST",
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    role: sessionData?.role,
                    username: sessionData?.username,
                    imageFile: base64Image || "default",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log("ress----", response)
            const result = await response.json()

            if (response.ok) {
                Alert.alert("Success", result.message)
            } else {
                Alert.alert("Error", result.message)
            }
        } catch (error) {
            console.error("Save error:", error)
            Alert.alert("Error", "Failed to save profile changes")
        } finally {
            setLoading(false)
        }
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
                        source={{
                            uri: profileImage || `https://www.portstay.com/imageController/${profilePic}.do` || "https://www.portstay.com/resources/img/Profile/default_user_image.png",
                        }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editAvatarButton} onPress={pickImage}>
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
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#06607a",
    },
    header: {
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    profileSection: {
        alignItems: "center",
        paddingVertical: 24,
        marginHorizontal: 16,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        borderWidth: 4,
        objectFit: 'contain',
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    editAvatarButton: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    editAvatarText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.7)",
    },
    valueContainer: {
        flexDirection: "row",
        gap: 20,
        justifyContent: "space-between",
        marginHorizontal: 30,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#FFFFFF",
        marginBottom: 8,
        marginLeft: 7,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        padding: 10,
        fontSize: 16,
        color: "#FFFFFF",
        width: 150,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
        gap: 12,
        marginBottom: 40,
    },
    saveButton: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 140,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    saveButtonText: {
        color: "#06607a",
        fontSize: 16,
        fontWeight: "600",
    },
})
