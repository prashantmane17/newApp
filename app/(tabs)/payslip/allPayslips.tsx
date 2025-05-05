import { Feather } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function allPayslips() {
    return (
        <View style={styles.container}>
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
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 25,
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
