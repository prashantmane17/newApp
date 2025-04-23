import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Calendar, Building2, User, Mail, Phone, Chrome as Home, MapPin, Building, CreditCard, Percent, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        name: 'It Mange J',
        department: 'IT Management',
        dateOfJoining: '',
        gender: 'male',
        dateOfBirth: '',
        employeeId: '',
        email: 'it@vivo.com',
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        accountHolder: '',
        bankName: '',
        ifsc: '',
        accountNumber: '',
        taxRegime: '',
        pan: '',
    });

    const SectionTitle = ({ title }: { title: string }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    const InputField = ({
        label,
        value,
        icon,
        onChangeText,
        placeholder = '',
    }: {
        label: string;
        value: string;
        icon: React.ReactNode;
        onChangeText: (text: string) => void;
        placeholder?: string;
    }) => (
        <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
                {icon}
                <Text style={styles.label}>{label}</Text>
            </View>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
            />
        </View>
    );

    const handleSave = () => {
        // Implement save functionality
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Profile</Text>
                    <TouchableOpacity style={styles.privacyButton} onPress={() => router.push("/(tabs)/msgDashboard/profile/password")}>
                        <Lock size={16} color="#4F46E5" />
                        <Text style={styles.privacyButtonText}>Privacy Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Text style={styles.editAvatarText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.profileName}>{profileData.name}</Text>
                <Text style={styles.profileRole}>{profileData.department}</Text>
            </View>

            <View style={styles.contentContainer}>
                <SectionTitle title="Basic Information" />
                <InputField
                    label="Date of Joining"
                    value={profileData.dateOfJoining}
                    icon={<Calendar size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, dateOfJoining: text })}
                />
                <InputField
                    label="Department"
                    value={profileData.department}
                    icon={<Building2 size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, department: text })}
                />
                <View style={styles.row}>
                    <View style={styles.genderContainer}>
                        <View style={styles.labelContainer}>
                            <User size={20} color="#4F46E5" />
                            <Text style={styles.label}>Gender</Text>
                        </View>
                        <View style={styles.genderOptions}>
                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    profileData.gender === 'male' && styles.genderOptionSelected,
                                ]}
                                onPress={() => setProfileData({ ...profileData, gender: 'male' })}
                            >
                                <Text
                                    style={[
                                        styles.genderOptionText,
                                        profileData.gender === 'male' && styles.genderOptionTextSelected,
                                    ]}
                                >
                                    Male
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    profileData.gender === 'female' && styles.genderOptionSelected,
                                ]}
                                onPress={() => setProfileData({ ...profileData, gender: 'female' })}
                            >
                                <Text
                                    style={[
                                        styles.genderOptionText,
                                        profileData.gender === 'female' && styles.genderOptionTextSelected,
                                    ]}
                                >
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <InputField
                    label="Date of Birth"
                    value={profileData.dateOfBirth}
                    icon={<Calendar size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
                />
                <InputField
                    label="Employee ID"
                    value={profileData.employeeId}
                    icon={<CreditCard size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, employeeId: text })}
                />

                <SectionTitle title="Contact Information" />
                <InputField
                    label="Email"
                    value={profileData.email}
                    icon={<Mail size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                />
                <InputField
                    label="Phone"
                    value={profileData.phone}
                    icon={<Phone size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                />
                <InputField
                    label="Address"
                    value={profileData.address}
                    icon={<Home size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, address: text })}
                />
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <InputField
                            label="Country"
                            value={profileData.country}
                            icon={<MapPin size={20} color="#4F46E5" />}
                            onChangeText={(text) => setProfileData({ ...profileData, country: text })}
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <InputField
                            label="State"
                            value={profileData.state}
                            icon={<MapPin size={20} color="#4F46E5" />}
                            onChangeText={(text) => setProfileData({ ...profileData, state: text })}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <InputField
                            label="City"
                            value={profileData.city}
                            icon={<Building size={20} color="#4F46E5" />}
                            onChangeText={(text) => setProfileData({ ...profileData, city: text })}
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <InputField
                            label="Zip Code"
                            value={profileData.zipCode}
                            icon={<MapPin size={20} color="#4F46E5" />}
                            onChangeText={(text) => setProfileData({ ...profileData, zipCode: text })}
                        />
                    </View>
                </View>

                <SectionTitle title="Banking Information" />
                <InputField
                    label="Account Holder Name"
                    value={profileData.accountHolder}
                    icon={<User size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, accountHolder: text })}
                />
                <InputField
                    label="Bank Name"
                    value={profileData.bankName}
                    icon={<Building size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, bankName: text })}
                />
                <InputField
                    label="IFSC"
                    value={profileData.ifsc}
                    icon={<Building size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, ifsc: text })}
                />
                <InputField
                    label="Account Number"
                    value={profileData.accountNumber}
                    icon={<CreditCard size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, accountNumber: text })}
                />
                <InputField
                    label="Tax Regime"
                    value={profileData.taxRegime}
                    icon={<Percent size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, taxRegime: text })}
                />
                <InputField
                    label="PAN"
                    value={profileData.pan}
                    icon={<CreditCard size={20} color="#4F46E5" />}
                    onChangeText={(text) => setProfileData({ ...profileData, pan: text })}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    privacyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    privacyButtonText: {
        color: '#4F46E5',
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
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
    },
    editAvatarButton: {
        backgroundColor: '#EEF2FF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    editAvatarText: {
        color: '#4F46E5',
        fontSize: 14,
        fontWeight: '500',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 16,
        color: '#64748B',
    },
    contentContainer: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
        marginTop: 12,
    },
    inputContainer: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1E293B',
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
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    genderOption: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    genderOptionSelected: {
        backgroundColor: '#4F46E5',
    },
    genderOptionText: {
        color: '#64748B',
        fontSize: 16,
    },
    genderOptionTextSelected: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    closeButtonText: {
        color: '#64748B',
        fontSize: 16,
        fontWeight: '600',
    },
});