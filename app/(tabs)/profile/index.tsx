import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    StatusBar,
    Alert,
} from 'react-native';
import { Calendar, Building2, User, Mail, Phone, Chrome as Home, MapPin, Building, CreditCard, Percent, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useSession } from '@/context/ContextSession';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>({
        phone: '',
        address: {
            area: '',
            country: '',
            state: '',
            city: '',
            zipCode: '',
        },
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { sessionData } = useSession();
    const SectionTitle = ({ title }: { title: string }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };
    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (event.type === 'set' && selectedDate) {
            setProfileData({ ...profileData, doj: formatDate(selectedDate.toISOString()) });
        }
    };
    const loadSalary = async () => {
        setLoading(true);
        const response = await fetch("https://www.portstay.com/setting-mobile", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json()
            console.log("jijojs---", data.userObj)
            setProfileData(data.userObj)
        }
        setLoading(false);
    }

    useEffect(() => {
        loadSalary();
    }, []);

    const uploadProfileImage = async () => {
        // Step 1: Pick image from device
        console.log('ki')
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
            const localUri = result.assets[0].uri;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename ?? '');
            const type = match ? `image/${match[1]}` : `image`;

            // Step 2: Prepare FormData
            const formData = new FormData();
            formData.append('file', {
                uri: localUri,
                name: filename,
                type: type,
            } as any);

            // Step 3: Send image to backend
            try {
                const response = await fetch('https://www.portstay.com/user-update-profile-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                    credentials: 'include', // to send session cookie
                });

                if (response.ok) {
                    const imagePath = await response.text(); // get image path from backend
                    setProfileData({ ...profileData, profile_pic: imagePath })
                } else {
                    console.log('Upload failed with status:', response.status);
                }
            } catch (err) {
                console.error('Error uploading image:', err);
            }
        }
    };

    const SuccessAlert = () => {
        if (!showSuccessAlert) return null;

        return (
            <View style={styles.alertOverlay}>
                <View style={styles.alertContainer}>
                    <View style={styles.alertIconContainer}>
                        <View style={styles.alertIconCircle}>
                            <Text style={styles.alertIconText}>✓</Text>
                        </View>
                    </View>
                    <Text style={styles.alertTitle}>Success!</Text>
                    <Text style={styles.alertMessage}>Profile updated successfully</Text>
                    <TouchableOpacity
                        style={styles.alertButton}
                        onPress={() => setShowSuccessAlert(false)}
                    >
                        <Text style={styles.alertButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();

        formData.append("doj", profileData.doj);
        formData.append("gender", profileData.gender);
        formData.append("empNumber", profileData.empNumber);
        formData.append("empType", profileData.empType);
        formData.append("dob", profileData.dob);
        formData.append("aboutTeam", profileData.aboutTeam);
        formData.append("phone", profileData.phone);
        formData.append("accNo", profileData.accNo);
        formData.append("panNumber", profileData.panNumber);
        formData.append("bankName", profileData.bankName);
        formData.append("taxRegime", profileData.taxRegime);
        formData.append("ifscCode", profileData.ifscCode);
        formData.append("acHolderName", profileData.acHolderName);
        formData.append("address.zipcode", profileData.address.zipCode);
        formData.append("address.city", profileData.address.city);
        formData.append("address.state", profileData.address.state);
        formData.append("address.country", profileData.address.country);
        formData.append("address.area", profileData.address.area);
        formData.append("email", profileData.email);

        try {
            const response = await fetch("https://www.portstay.com/update-profile", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });
            console.log("respons----", response)
            const result = await response.json();
            console.log("Success:", result);

            setShowSuccessAlert(true);

            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);

        } catch (error) {
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />
            <SuccessAlert />

            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Profile</Text>
                        {sessionData?.role !== 'Superadmin' && (

                            <TouchableOpacity style={styles.privacyButton} onPress={() => router.push("/(tabs)/profile/password")}>
                                <Lock size={16} color="#FFFFFF" />
                                <Text style={styles.privacyButtonText}>Privacy Settings</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    </View>
                ) : (

                    <>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: `https://www.portstay.com/imageController/${profileData?.profile_pic}.do` || 'https://www.portstay.com/resources/img/Profile/default_user_image.png' }}
                                    style={styles.avatar}
                                />
                                <TouchableOpacity style={styles.editAvatarButton} onPress={uploadProfileImage}>
                                    <Text style={styles.editAvatarText}>Change Photo</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.profileName}>{profileData?.name}</Text>
                            <Text style={styles.profileRole}>{profileData?.aboutMe}</Text>
                        </View>

                        {sessionData?.role !== 'Superadmin' && (
                            <View style={styles.contentContainer}>
                                <SectionTitle title="Basic Information" />

                                {/* Date of Joining */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Date of Joining</Text>
                                    {profileData?.doj ? (
                                        <Text style={styles.input}>{profileData.doj}</Text>

                                    ) : (<>
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                            <Text style={styles.input}>Select Date of Joining</Text>
                                        </TouchableOpacity>
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={new Date()}
                                                mode="date"
                                                display="default"
                                                onChange={handleDateChange}
                                            />
                                        )}
                                    </>
                                    )}

                                </View>

                                {/* Department */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Department</Text>
                                    <Text style={styles.input}>{profileData?.aboutTeam}</Text>
                                </View>

                                {/* Gender */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Gender</Text>
                                    <View style={styles.genderOptions}>
                                        <TouchableOpacity
                                            style={[
                                                styles.genderOption,
                                                profileData?.gender === 'Male' && styles.genderOptionSelected,
                                            ]}
                                            onPress={() => setProfileData({ ...profileData, gender: 'Male' })}
                                        >
                                            <Text
                                                style={[
                                                    styles.genderOptionText,
                                                    profileData?.gender === 'Male' && styles.genderOptionTextSelected,
                                                ]}
                                            >
                                                Male
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.genderOption,
                                                profileData?.gender === 'Female' && styles.genderOptionSelected,
                                            ]}
                                            onPress={() => setProfileData({ ...profileData, gender: 'Female' })}
                                        >
                                            <Text
                                                style={[
                                                    styles.genderOptionText,
                                                    profileData?.gender === 'Female' && styles.genderOptionTextSelected,
                                                ]}
                                            >
                                                Female
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Date of Birth */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.dob}
                                        onChangeText={(text) => setProfileData({ ...profileData, dob: text })}
                                        placeholder="Enter date of birth"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* Employee Type */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Employee Type</Text>
                                    {profileData?.empType !== '' && profileData?.empType !== 'null' ? (

                                        <Text style={styles.input}>{profileData?.empType}</Text>
                                    ) : (
                                        <View style={styles.pickerWrapper}>
                                            <Picker
                                                selectedValue={profileData.empType}
                                                onValueChange={(value) =>
                                                    setProfileData({ ...profileData, empType: value })
                                                }
                                                style={styles.picker}
                                                dropdownIconColor="#000"
                                            >
                                                <Picker.Item label="Select employee type" value={null} color="#94A3B8" />
                                                <Picker.Item label="Full Time" value="Full Time" />
                                                <Picker.Item label="Part Time" value="Part Time" />
                                                <Picker.Item label="Contract" value="Contract" />
                                            </Picker>
                                        </View>
                                    )}
                                </View>

                                {/* Employee ID */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Employee ID</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.empNumber}
                                        onChangeText={(text) => setProfileData({ ...profileData, empNumber: text })}
                                        placeholder="Enter employee ID"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                <SectionTitle title="Contact Information" />

                                {/* Email */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Email</Text>
                                    <Text style={styles.input}>{profileData?.email}</Text>
                                    {/* <TextInput
                                    style={styles.input}
                                    value={profileData?.email}
                                    onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#94A3B8"
                                /> */}
                                </View>

                                {/* Phone */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Phone</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.phone}
                                        onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                                        placeholder="Enter your phone number"
                                        keyboardType="phone-pad"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* Address */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.address?.area}
                                        onChangeText={(text) => setProfileData({
                                            ...profileData, address: {
                                                ...profileData.address,
                                                area: text,
                                            }
                                        })}
                                        placeholder="Enter your address"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        {/* Country */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Country</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={profileData?.address?.country}
                                                onChangeText={(text) => setProfileData({
                                                    ...profileData, address: {
                                                        ...profileData.address,
                                                        country: text,
                                                    }
                                                })}
                                                placeholder="Enter country"
                                                placeholderTextColor="#94A3B8"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.halfWidth}>
                                        {/* State */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>State</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={profileData?.address?.state}
                                                onChangeText={(text) => setProfileData({
                                                    ...profileData, address: {
                                                        ...profileData.address,
                                                        state: text,
                                                    }
                                                })}
                                                placeholder="Enter state"
                                                placeholderTextColor="#94A3B8"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        {/* City */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>City</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={profileData?.address?.city}
                                                onChangeText={(text) => setProfileData({
                                                    ...profileData, address: {
                                                        ...profileData.address,
                                                        city: text,
                                                    }
                                                })}
                                                placeholder="Enter city"
                                                placeholderTextColor="#94A3B8"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.halfWidth}>
                                        {/* Zip Code */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Zip Code</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={profileData?.address?.zipCode}
                                                onChangeText={(text) => setProfileData({
                                                    ...profileData, address: {
                                                        ...profileData.address,
                                                        zipCode: text,
                                                    }
                                                })}
                                                placeholder="Enter zip code"
                                                keyboardType="numeric"
                                                placeholderTextColor="#94A3B8"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <SectionTitle title="Banking Information" />

                                {/* Account Holder Name */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Account Holder Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.acHolderName}
                                        onChangeText={(text) => setProfileData({ ...profileData, acHolderName: text })}
                                        placeholder="Enter account holder name"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* Bank Name */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Bank Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.bankName}
                                        onChangeText={(text) => setProfileData({ ...profileData, bankName: text })}
                                        placeholder="Enter bank name"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* IFSC */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>IFSC</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.ifscCode}
                                        onChangeText={(text) => setProfileData({ ...profileData, ifscCode: text })}
                                        placeholder="Enter IFSC code"
                                        autoCapitalize="characters"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* Account Number */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Account Number</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.accNo}
                                        onChangeText={(text) => setProfileData({ ...profileData, accNo: text })}
                                        placeholder="Enter account number"
                                        keyboardType="numeric"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* Tax Regime */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Tax Regime</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.taxRegime}
                                        onChangeText={(text) => setProfileData({ ...profileData, taxRegime: text })}
                                        placeholder="Enter tax regime"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {/* PAN */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>PAN</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData?.panNumber}
                                        onChangeText={(text) => setProfileData({ ...profileData, panNumber: text })}
                                        placeholder="Enter PAN number"
                                        autoCapitalize="characters"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#06607a',
    },
    container: {
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
    privacyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    privacyButtonText: {
        color: '#FFFFFF',
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
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
    contentContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        marginTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        paddingBottom: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#FFFFFF',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 10,
    },
    picker: {
        height: Platform.OS === 'ios' ? 200 : 50,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    halfWidth: {
        width: '48%',
    },
    genderContainer: {
        flex: 1,
    },
    genderOptions: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    genderOption: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    genderOptionSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    genderOptionText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
    },
    genderOptionTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
    closeButton: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 140,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Alert styles
    alertOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    alertContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    alertIconContainer: {
        marginBottom: 16,
    },
    alertIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertIconText: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    alertTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    alertMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    alertButton: {
        backgroundColor: '#06607a',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    alertButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});