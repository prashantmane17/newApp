import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, StatusBar } from 'react-native';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validatePasswords = () => {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const handleResetPassword = () => {
        if (validatePasswords()) {
            // Password reset successful
            router.replace('/'); // Navigate to login screen after successful reset
        }
    };

    return (
        <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
            <View style={styles.header}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Create a new password for your account
                </Text>
            </View>

            <View style={styles.formSection}>
                <View style={styles.formCard}>
                    {/* Password Field */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <View style={styles.passwordInputWrapper}>
                            <Lock size={20} color="#4F46E5" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password Field */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <View style={styles.passwordInputWrapper}>
                            <Lock size={20} color="#4F46E5" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                                {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Password Requirements */}
                    <View style={styles.passwordRequirements}>
                        <Text style={styles.requirementsTitle}>Password must contain:</Text>
                        <View style={styles.requirementItem}>
                            <Check size={16} color={password.length >= 8 ? "#059669" : "#9CA3AF"} />
                            <Text style={[styles.requirementText, password.length >= 8 && styles.requirementMet]}>
                                At least 8 characters
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Check size={16} color={/[A-Z]/.test(password) ? "#059669" : "#9CA3AF"} />
                            <Text style={[styles.requirementText, /[A-Z]/.test(password) && styles.requirementMet]}>
                                At least one uppercase letter
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Check size={16} color={/[0-9]/.test(password) ? "#059669" : "#9CA3AF"} />
                            <Text style={[styles.requirementText, /[0-9]/.test(password) && styles.requirementMet]}>
                                At least one number
                            </Text>
                        </View>
                    </View>

                    {/* Error Message */}
                    {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}

                    {/* Reset Button */}
                    <TouchableOpacity
                        onPress={handleResetPassword}
                        style={styles.resetButton}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
    },
    subtitle: {
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    formSection: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: 'white',
    },
    inputIcon: {
        marginLeft: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#111827',
    },
    eyeIcon: {
        padding: 12,
    },
    passwordRequirements: {
        marginTop: 8,
        marginBottom: 20,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    requirementText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#6B7280',
    },
    requirementMet: {
        color: '#059669',
    },
    errorText: {
        color: '#DC2626',
        marginBottom: 16,
        fontSize: 14,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#4F46E5',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});