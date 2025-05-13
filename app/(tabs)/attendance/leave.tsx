import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function LeaveCard() {
    const router = useRouter();
    const [leaveData, setLeaveData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadLeaveData = async () => {
        try {
            const response = await fetch("http://192.168.1.25:8080/my-time-off-request-list-mobile", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data.offRequests);
                setLeaveData(data.offRequests);
            } else {
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaveData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Leave</Text>
            </View>

            {/* Loader */}
            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView>
                    {leaveData.length === 0 ? (
                        <Text style={styles.noData}>No leave requests found.</Text>
                    ) : (
                        leaveData.map((leave, index) => (
                            <View key={index} style={styles.card}>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Leave Date:</Text>
                                    <Text style={styles.value}>{leave.follow_Date}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.label}>Reason:</Text>
                                    <Text style={styles.value}>{leave.taskName}</Text>
                                </View>

                                <View style={styles.combinedrow}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Days:</Text>
                                        <Text style={styles.value}>{leave.noOfDays}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Status:</Text>
                                        <Text style={[styles.value, leave.status === 'pending' && styles.pending]}>
                                            {leave.status}
                                        </Text>
                                    </View>
                                </View>


                                <Text style={styles.appliedDate}>
                                    Applied on {leave.date}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06607a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#008374',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    combinedrow: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        fontWeight: 'bold',
        width: 100,
        color: '#333',
    },
    value: {
        flex: 1,
        color: '#444',
    },
    appliedDate: {
        marginTop: 8,
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    pending: {
        color: '#FF8C00',
        fontWeight: 'bold',
    },
    noData: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
});
