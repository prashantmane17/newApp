import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSession } from '@/context/ContextSession';

export default function LoginScreen() {
    const { getSessionDetails } = useSession();
    const [currentScreen, setCurrentScreen] = useState('login');
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const codeInputRefs = useRef<(TextInput | null)[]>(new Array(6).fill(null));
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleLogin = async () => {
        console.log("joio")
        const response = await fetch("http://192.168.1.26:8080/employee-login-mobile?workinguserName=" + email, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const passwordRes = await fetch("http://192.168.1.26:8080/login-user", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        });

        const data = await passwordRes.json();
        if (response.ok) {
            if (data.validated) {
                console.log("hiiii")
                try {
                    const homeResponse = await fetch(`http://192.168.1.26:8080//login-user-mobile?username=${encodeURIComponent(email)}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const homdata = await homeResponse.json();
                    console.log("reddddd------", homdata);
                    getSessionDetails();
                    Alert.alert("Sucsess", "Loged in suceessfully!!")
                    router.replace('/(tabs)');
                }
                catch (err) {
                    console.log("eroo----", err)
                }
            } else {
                Alert.alert("error", "Wrong password!!")
            }
        }
        else {
            Alert.alert("error", "Wrong email!!")
        }

    };
    const handleForgotPassword = () => {
        router.replace('/(tabs)');
        // setCurrentScreen('forgotPassword');
    };

    const handleBackToLogin = () => {
        setCurrentScreen('login');
    };

    const handleSendCode = () => {
        // Dummy function to simulate sending verification code
        Alert.alert("Code Sent", `A verification code has been sent to ${email}`);
        setVerificationCode(['', '', '', '', '', ''])
        setCurrentScreen('verificationCode');
    };

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...verificationCode];
        newCode[index] = text;
        setVerificationCode(newCode);

        // Auto-advance to next input if a digit was entered
        if (text.length === 1 && index < 5) {
            codeInputRefs.current[index + 1]?.focus(); // ✅ Type-safe focus()
        }
    };

    const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
        // Handle backspace to move to previous input
        if (e.nativeEvent.key === "Backspace" && index > 0 && verificationCode[index] === "") {
            codeInputRefs.current[index - 1]?.focus(); // ✅ Type-safe focus()
        }
    };

    const handleVerifyCode = () => {
        const code = verificationCode.join('');
        if (code.length === 6) {
            // Dummy verification - in a real app, you'd verify with your backend
            if (code === '123456') {
                Alert.alert("Success", "Verification successful! You can now reset your password.");
                setCurrentScreen('newPassword');
            } else {
                Alert.alert("Error", "Invalid verification code. Please try again.");
            }
        } else {
            Alert.alert("Error", "Please enter all 6 digits of the verification code.");
        }
    };
    const validatePasswords = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        setPasswordError('');
        return true;
    };
    const handleResetPassword = () => {
        if (validatePasswords()) {
            Alert.alert("Success", "Password reset successfully.");
            router.replace('/');
        }
    };

    const renderLoginScreen = () => (
        <>
            <View style={styles.logoContainer}>
                <ColorfulSpiral />
            </View>

            <Text style={styles.welcomeText}>Welcome!</Text>
            <View style={styles.crmTextContainer}>
                <Text style={styles.toText}>to </Text>
                <Text style={styles.crmText}>Portstay</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Emial</Text>
                <View style={styles.phoneInputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.phoneIconContainer}>
                        <Ionicons name="mail" size={20} color="#7B68EE" />
                    </View>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                        <View style={styles.eyeIconContainer}>
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#999"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}
                >Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
            >
                <Text style={styles.forgotPasswordText}>I forgot my password</Text>
            </TouchableOpacity>
        </>
    );

    const renderForgotPasswordScreen = () => (
        <>
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToLogin}
            >
                <Ionicons name="arrow-back" size={24} color="#7B68EE" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <ColorfulSpiral />
            </View>

            <Text style={styles.welcomeText}>Forgot Password</Text>
            <Text style={styles.forgotPasswordDescription}>
                Enter your Email and we'll send you a verification code
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.phoneInputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.phoneIconContainer}>
                        <Ionicons name="mail" size={20} color="#7B68EE" />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSendCode}
            >
                <Text style={styles.loginButtonText}>Send Verification Code</Text>
            </TouchableOpacity>
        </>
    );

    const renderVerificationCodeScreen = () => (
        <>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentScreen('forgotPassword')}
            >
                <Ionicons name="arrow-back" size={24} color="#7B68EE" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <ColorfulSpiral />
            </View>

            <Text style={styles.welcomeText}>Verification Code</Text>
            <Text style={styles.forgotPasswordDescription}>
                Enter the 6-digit code sent to {email}
            </Text>

            <View style={styles.codeInputContainer}>
                {verificationCode.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={ref => codeInputRefs.current[index] = ref}
                        style={styles.codeInput}
                        value={digit}
                        onChangeText={text => handleCodeChange(text, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                    />
                ))}
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleVerifyCode}
            >
                <Text style={styles.loginButtonText}>Verify Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendCodeContainer}>
                <Text style={styles.forgotPasswordText}>Resend Code</Text>
            </TouchableOpacity>

            {/* <Text style={styles.dummyCodeText}>
                Dummy code for testing: 123456
            </Text> */}
        </>
    );
    const renderNewPasswordScreen = () => (
        <>
            <View style={styles.logoContainer}>
                <ColorfulSpiral />
            </View>

            {/* <Text style={styles.welcomeText}>Create a new password for your account</Text> */}
            <View style={styles.crmTextContainer}>
                <Text style={styles.crmText}>Reset Password</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.phoneInputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={toggleNewPasswordVisibility} style={styles.eyeIcon}>
                        {showNewPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordInputWrapper}>
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

            {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            {/* Reset Button */}
            <TouchableOpacity
                onPress={handleResetPassword}
                style={styles.resetButton}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>


        </>
    );
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {currentScreen === 'login' && renderLoginScreen()}
                    {currentScreen === 'forgotPassword' && renderForgotPasswordScreen()}
                    {currentScreen === 'verificationCode' && renderVerificationCodeScreen()}
                    {currentScreen === 'newPassword' && renderNewPasswordScreen()}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Custom component for the colorful spiral logo
const ColorfulSpiral = () => (
    <Svg width={120} height={120} viewBox="0 0 200 200">
        <Defs>
            <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#C5E8FF" />
                <Stop offset="50%" stopColor="#7B68EE" />
                <Stop offset="100%" stopColor="#9932CC" />
            </LinearGradient>
        </Defs>
        <G>
            {Array.from({ length: 24 }).map((_, i) => (
                <Path
                    key={i}
                    d={`M 100,100 L ${100 + 70 * Math.cos(i * Math.PI / 12)},${100 + 70 * Math.sin(i * Math.PI / 12)}`}
                    stroke="url(#grad1)"
                    strokeWidth={12}
                    strokeLinecap="round"
                    transform={`rotate(${i * 15}, 100, 100)`}
                    opacity={0.8 + (i / 24) * 0.2}
                />
            ))}
        </G>
    </Svg>
);

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center", padding: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    crmTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    toText: {
        fontSize: 28,
    },
    crmText: {
        fontSize: 28,
        color: '#7B68EE',
        fontWeight: 'bold',
    },
    forgotPasswordDescription: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#999',
        marginBottom: 5,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#7B68EE',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    phoneIconContainer: {
        padding: 5,
    },
    eyeIconContainer: {
        padding: 5,
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    codeInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#7B68EE',
        borderRadius: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#7B68EE',
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    forgotPasswordContainer: {
        marginTop: 20,
    },
    forgotPasswordText: {
        color: '#7B68EE',
        fontSize: 14,
    },
    resendCodeContainer: {
        marginTop: 20,
    },
    dummyCodeText: {
        marginTop: 30,
        color: '#999',
        fontSize: 12,
    },
    eyeIcon: {
        padding: 12,
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