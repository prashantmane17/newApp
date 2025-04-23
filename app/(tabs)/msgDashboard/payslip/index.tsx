import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"

export default function HomeScreen() {
    const router = useRouter();
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>Payslip and Attendance</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Feather name="user" size={24} color="#4f46e5" />
                </TouchableOpacity>
            </View>

            <View style={styles.salaryCard}>
                <Text style={styles.salaryLabel}>Net Salary - March 2025</Text>
                <Text style={styles.salaryAmount}>$4,250.00</Text>
                <View style={styles.salaryDetails}>
                    <View style={styles.salaryItem}>
                        <Text style={styles.salaryItemLabel}>Gross</Text>
                        <Text style={styles.salaryItemValue}>$5,000.00</Text>
                    </View>
                    <View style={styles.salaryItem}>
                        <Text style={styles.salaryItemLabel}>Deductions</Text>
                        <Text style={styles.salaryItemValue}>$750.00</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewDetailsButton} >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Feather name="chevron-right" size={16} color="#4f46e5" />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(tabs)/payslip/payslips")}>
                    <View style={styles.actionIconContainer}>
                        <Feather name="file-text" size={24} color="#4f46e5" />
                    </View>
                    <Text style={styles.actionTitle}>Payslips</Text>
                    <Text style={styles.actionDescription}>View and download your payslips</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(tabs)/payslip/attendance")}>
                    <View style={styles.actionIconContainer} >
                        <Feather name="calendar" size={24} color="#4f46e5" />
                    </View>
                    <Text style={styles.actionTitle}>Attendance</Text>
                    <Text style={styles.actionDescription}>Check your attendance records</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionIconContainer}>
                        <Feather name="clock" size={24} color="#4f46e5" />
                    </View>
                    <Text style={styles.actionTitle}>Time Off</Text>
                    <Text style={styles.actionDescription}>Request and manage leave</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionIconContainer}>
                        <Feather name="help-circle" size={24} color="#4f46e5" />
                    </View>
                    <Text style={styles.actionTitle}>Support</Text>
                    <Text style={styles.actionDescription}>Get help with payroll issues</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <View style={styles.activityList}>
                <View style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                        <Feather name="file-text" size={20} color="#4f46e5" />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>March 2025 Payslip</Text>
                        <Text style={styles.activityDate}>March 31, 2025</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                </View>

                <View style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                        <Feather name="calendar" size={20} color="#4f46e5" />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Attendance Updated</Text>
                        <Text style={styles.activityDate}>March 30, 2025</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                </View>

                <View style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                        <Feather name="clock" size={20} color="#4f46e5" />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Leave Request Approved</Text>
                        <Text style={styles.activityDate}>March 28, 2025</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 30,
        backgroundColor: "#fff",
    },
    greeting: {
        fontSize: 14,
        color: "#6b7280",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    salaryCard: {
        margin: 16,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    salaryLabel: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 4,
    },
    salaryAmount: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    salaryDetails: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
        paddingTop: 16,
    },
    salaryItem: {
        flex: 1,
    },
    salaryItemLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 4,
    },
    salaryItemValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    viewDetailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4f46e5",
        marginRight: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    quickActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 8,
    },
    actionCard: {
        width: "50%",
        padding: 8,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#ede9fe",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        color: "#6b7280",
    },
    activityList: {
        backgroundColor: "#fff",
        borderRadius: 12,
        margin: 16,
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    activityItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    activityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#ede9fe",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    activityDate: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
})

