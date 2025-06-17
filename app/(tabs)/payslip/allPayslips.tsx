import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function allPayslips() {
    const [payslips, setPayslips] = useState<any>([]);
    const loadSalary = async () => {
        const payslipResponse = await fetch("http://192.168.1.25:8080/employee-Payslip-Details-mobile", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        if (payslipResponse.ok) {
            const paySlipData = await payslipResponse.json();
            setPayslips(paySlipData.payrunData)
        }
    }
    useEffect(() => {
        loadSalary();
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.backButtonText}>Payslips</Text>
            </View>
            <View style={styles.activityList}>
                {payslips
                    .filter((item: any) => item.approveStatus !== "Pending")
                    .length > 0 ? (
                    payslips
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
                        ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Feather name="file-text" size={40} color="#9ca3af" />
                        <Text style={styles.emptyText}>No approved payslips found</Text>
                        {/* <Text style={styles.emptySubText}>Your approved payslips will appear here</Text> */}
                    </View>
                )}
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#06607a",
        paddingTop: 25,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#008374',
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 8,
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
        marginBottom: 10,
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
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginTop: 12,
    },
    emptySubText: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
        textAlign: 'center',
    },
})
