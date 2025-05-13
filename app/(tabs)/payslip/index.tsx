import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react";

export default function HomeScreen() {
    const router = useRouter();
    const [empSalary, setEmpSalary] = useState<any>({});
    const [payslips, setPayslips] = useState<any>([]);
    const loadSalary = async () => {
        const response = await fetch("http://192.168.1.25:8080/employee-salary-Details-mobile", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json()
            setEmpSalary(data)
        }
        const payslipResponse = await fetch("http://192.168.1.25:8080/employee-Payslip-Details-mobile", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        if (payslipResponse.ok) {
            const paySlipData = await payslipResponse.json()
            console.log("jijiji----", paySlipData)
            setPayslips(paySlipData.payrunData)
        }
    }
    useEffect(() => {
        loadSalary();
    }, [])
    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#008374" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>Payroll </Text>
                </View>
                {/* <TouchableOpacity style={styles.profileButton}>
                    <Feather name="user" size={24} color="#4f46e5" />
                </TouchableOpacity> */}
            </View>

            <View style={styles.salaryCard}>
                <Text style={styles.salaryLabel}>Net Salary</Text>
                <Text style={styles.salaryAmount}>₹{empSalary?.monthlyCTC}</Text>
                <View style={styles.salaryDetails}>
                    <View style={styles.salaryItem}>
                        <Text style={styles.salaryItemLabel}>Gross</Text>
                        <Text style={styles.salaryItemValue}>₹{empSalary?.grossPay}</Text>
                    </View>
                    <View style={styles.salaryItem}>
                        <Text style={styles.salaryItemLabel}>Deductions</Text>
                        <Text style={styles.salaryItemValue}>₹{empSalary?.deductionAmt}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewDetailsButton} onPress={() => router.push(`/(tabs)/payslip/payslips?data=${encodeURIComponent(JSON.stringify(empSalary))}`)}>
                    <Text style={styles.viewDetailsText}>View Salary</Text>
                    <Feather name="chevron-right" size={16} color="#4f46e5" />
                </TouchableOpacity>
            </View>

            <View style={styles.headerView}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity style={styles.viewSlip} onPress={() => router.push("/(tabs)/payslip/allPayslips")}>
                    <Text style={[{ color: "white" }]} >View Payslips</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.activityList}>
                {payslips
                    .filter((item: any) => item.approveStatus !== "Pending")
                    .map((item: any, index: number) => (
                        <TouchableOpacity
                            style={styles.activityItem}
                            key={index}
                            onPress={() =>
                                router.push({
                                    pathname: "/(tabs)/payslip/payslipTemplate2",
                                    params: { email: item.email, salMonth: item.payMonth },
                                })
                            }
                        >
                            <View style={styles.activityIconContainer}>
                                <Feather name="file-text" size={20} color="#4f46e5" />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>{item.payMonth} Payslip</Text>
                                <Text style={styles.activityDate}>₹{item.monthCtc}</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    ))}

            </View>
            {payslips.length === 0 && (
                <View style={styles.notfundMsg}>
                    <Text style={styles.notfound}>Payslips not found</Text>
                </View>
            )}
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#06607a",
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 30,
        backgroundColor: "#008374",
    },
    notfundMsg: {
        backgroundColor: 'transparent',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    notfound: {
        color: '#6b7280',
        fontSize: 20,
        fontWeight: '500',
    },


    greeting: {
        fontSize: 14,
        color: "#6b7280",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
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
    headerView: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",

    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#f5f5f5",
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    viewSlip: {
        marginHorizontal: 16,
        backgroundColor: "#3396f3",
        padding: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
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

