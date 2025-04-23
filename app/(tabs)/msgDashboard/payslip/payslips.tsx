import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Share, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Sample data for payslips - expanded to show all months
const payslipsData = [
    {
        id: '1',
        month: 'March',
        year: '2025',
        date: 'March 31, 2025',
        amount: '$4,250.00',
        status: 'Paid',
    },
    {
        id: '2',
        month: 'February',
        year: '2025',
        date: 'February 28, 2025',
        amount: '$4,250.00',
        status: 'Paid',
    },
    {
        id: '3',
        month: 'January',
        year: '2025',
        date: 'January 31, 2025',
        amount: '$4,250.00',
        status: 'Paid',
    },
    {
        id: '4',
        month: 'December',
        year: '2024',
        date: 'December 31, 2024',
        amount: '$4,100.00',
        status: 'Paid',
    },
    {
        id: '5',
        month: 'November',
        year: '2024',
        date: 'November 30, 2024',
        amount: '$4,100.00',
        status: 'Paid',
    },
    {
        id: '6',
        month: 'October',
        year: '2024',
        date: 'October 31, 2024',
        amount: '$4,100.00',
        status: 'Paid',
    },
    {
        id: '7',
        month: 'September',
        year: '2024',
        date: 'September 30, 2024',
        amount: '$4,100.00',
        status: 'Paid',
    },
    {
        id: '8',
        month: 'August',
        year: '2024',
        date: 'August 31, 2024',
        amount: '$4,100.00',
        status: 'Paid',
    },
    {
        id: '9',
        month: 'July',
        year: '2024',
        date: 'July 31, 2024',
        amount: '$4,100.00',
        status: 'Paid',
    },
    {
        id: '10',
        month: 'June',
        year: '2024',
        date: 'June 30, 2024',
        amount: '$4,000.00',
        status: 'Paid',
    },
    {
        id: '11',
        month: 'May',
        year: '2024',
        date: 'May 31, 2024',
        amount: '$4,000.00',
        status: 'Paid',
    },
    {
        id: '12',
        month: 'April',
        year: '2024',
        date: 'April 30, 2024',
        amount: '$4,000.00',
        status: 'Paid',
    },
];

export default function PayslipsScreen() {
    const [selectedPayslip, setSelectedPayslip] = useState(payslipsData[1]);
    const [showPdf, setShowPdf] = useState(false);
    const [filterYear, setFilterYear] = useState('All');

    // Filter payslips based on selected year
    const filteredPayslips = filterYear === 'All'
        ? payslipsData
        : payslipsData.filter(item => item.year === filterYear);

    const handleSharePayslip = async () => {
        try {
            await Share.share({
                message: `${selectedPayslip.month} ${selectedPayslip.year} Payslip - Net Amount: ${selectedPayslip.amount}`,
                title: `${selectedPayslip.month} ${selectedPayslip.year} Payslip`,
                url: 'https://example.com/payslip.pdf', // This would be the actual PDF URL in a real app
            });
        } catch (error) {
            console.error('Error sharing payslip:', error);
        }
    };
    interface Payslip {
        id: string;
        month: string;
        year: string;
        date: string;
        amount: string;
        status: string;
    }
    const renderPayslipItem = ({ item }: { item: Payslip }) => (
        <TouchableOpacity
            style={styles.payslipItem}
            onPress={() => {
                setSelectedPayslip(item);
                setShowPdf(false);
            }}
        >
            <View style={styles.payslipIconContainer}>
                <Feather name="file-text" size={20} color="#4f46e5" />
            </View>
            <View style={styles.payslipContent}>
                <Text style={styles.payslipTitle}>{item.month} {item.year} Payslip</Text>
                <Text style={styles.payslipDate}>{item.date}</Text>
            </View>
            <View style={styles.payslipAmountContainer}>
                <Text style={styles.payslipAmount}>{item.amount}</Text>
                <View style={styles.payslipStatusContainer}>
                    <View style={styles.payslipStatusDot} />
                    <Text style={styles.payslipStatus}>{item.status}</Text>
                </View>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
    );

    const renderPdfViewer = () => (
        <View style={styles.pdfContainer}>
            {/* This would be a PDF viewer in a real app, using a placeholder image here */}
            <View style={styles.pdfHeader}>
                <Text style={styles.pdfHeaderTitle}>
                    {selectedPayslip.month} {selectedPayslip.year} Payslip
                </Text>
            </View>

            <View style={styles.pdfContent}>
                {/* Placeholder for PDF content */}
                <View style={styles.pdfPlaceholder}>
                    <View style={styles.pdfCompanyHeader}>
                        <Text style={styles.pdfCompanyName}>ACME CORPORATION</Text>
                        <Text style={styles.pdfDocumentTitle}>PAYSLIP</Text>
                        <Text style={styles.pdfPeriod}>Pay Period: {selectedPayslip.month} {selectedPayslip.year}</Text>
                    </View>

                    <View style={styles.pdfEmployeeInfo}>
                        <View style={styles.pdfInfoColumn}>
                            <Text style={styles.pdfInfoLabel}>Employee:</Text>
                            <Text style={styles.pdfInfoValue}>John Doe</Text>
                            <Text style={styles.pdfInfoLabel}>Employee ID:</Text>
                            <Text style={styles.pdfInfoValue}>EMP-12345</Text>
                        </View>
                        <View style={styles.pdfInfoColumn}>
                            <Text style={styles.pdfInfoLabel}>Department:</Text>
                            <Text style={styles.pdfInfoValue}>Engineering</Text>
                            <Text style={styles.pdfInfoLabel}>Position:</Text>
                            <Text style={styles.pdfInfoValue}>Senior Developer</Text>
                        </View>
                    </View>

                    <View style={styles.pdfTable}>
                        <View style={styles.pdfTableHeader}>
                            <Text style={[styles.pdfTableCell, styles.pdfTableHeaderText]}>Earnings</Text>
                            <Text style={[styles.pdfTableCell, styles.pdfTableHeaderText]}>Amount</Text>
                        </View>
                        <View style={styles.pdfTableRow}>
                            <Text style={styles.pdfTableCell}>Basic Salary</Text>
                            <Text style={styles.pdfTableCell}>$4,000.00</Text>
                        </View>
                        <View style={styles.pdfTableRow}>
                            <Text style={styles.pdfTableCell}>Bonus</Text>
                            <Text style={styles.pdfTableCell}>$500.00</Text>
                        </View>
                        <View style={styles.pdfTableRow}>
                            <Text style={styles.pdfTableCell}>Overtime</Text>
                            <Text style={styles.pdfTableCell}>$500.00</Text>
                        </View>
                        <View style={[styles.pdfTableRow, styles.pdfTableTotal]}>
                            <Text style={[styles.pdfTableCell, styles.pdfTableTotalText]}>Total Earnings</Text>
                            <Text style={[styles.pdfTableCell, styles.pdfTableTotalText]}>$5,000.00</Text>
                        </View>
                    </View>

                    <View style={styles.pdfTable}>
                        <View style={styles.pdfTableHeader}>
                            <Text style={[styles.pdfTableCell, styles.pdfTableHeaderText]}>Deductions</Text>
                            <Text style={[styles.pdfTableCell, styles.pdfTableHeaderText]}>Amount</Text>
                        </View>
                        <View style={styles.pdfTableRow}>
                            <Text style={styles.pdfTableCell}>Income Tax</Text>
                            <Text style={styles.pdfTableCell}>$500.00</Text>
                        </View>
                        <View style={styles.pdfTableRow}>
                            <Text style={styles.pdfTableCell}>Health Insurance</Text>
                            <Text style={styles.pdfTableCell}>$150.00</Text>
                        </View>
                        <View style={styles.pdfTableRow}>
                            <Text style={styles.pdfTableCell}>Retirement</Text>
                            <Text style={styles.pdfTableCell}>$100.00</Text>
                        </View>
                        <View style={[styles.pdfTableRow, styles.pdfTableTotal]}>
                            <Text style={[styles.pdfTableCell, styles.pdfTableTotalText]}>Total Deductions</Text>
                            <Text style={[styles.pdfTableCell, styles.pdfTableTotalText]}>$750.00</Text>
                        </View>
                    </View>

                    <View style={styles.pdfNetPay}>
                        <Text style={styles.pdfNetPayLabel}>NET PAY</Text>
                        <Text style={styles.pdfNetPayAmount}>{selectedPayslip.amount}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.pdfActions}>
                <TouchableOpacity style={styles.pdfActionButton} onPress={() => console.log('Download PDF')}>
                    <Feather name="download" size={20} color="#4f46e5" />
                    <Text style={styles.pdfActionText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pdfActionButton} onPress={handleSharePayslip}>
                    <Feather name="share-2" size={20} color="#4f46e5" />
                    <Text style={styles.pdfActionText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pdfActionButton} onPress={() => console.log('Print PDF')}>
                    <Feather name="printer" size={20} color="#4f46e5" />
                    <Text style={styles.pdfActionText}>Print</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {selectedPayslip ? (
                showPdf ? (
                    <View style={styles.pdfViewerContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setShowPdf(false)}
                        >
                            <Feather name="arrow-left" size={20} color="#4f46e5" />
                            <Text style={styles.backButtonText}>Back to Details</Text>
                        </TouchableOpacity>

                        {renderPdfViewer()}
                    </View>
                ) : (
                    <ScrollView style={styles.payslipDetailContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSelectedPayslip(payslipsData[0])}
                        >
                            <Feather name="arrow-left" size={20} color="#4f46e5" />
                            <Text style={styles.backButtonText}>Back to Payslips</Text>
                        </TouchableOpacity>

                        <View style={styles.payslipDetailHeader}>
                            <Text style={styles.payslipDetailTitle}>
                                {selectedPayslip.month} {selectedPayslip.year} Payslip
                            </Text>
                            <Text style={styles.payslipDetailDate}>{selectedPayslip.date}</Text>
                        </View>

                        <View style={styles.payslipDetailCard}>
                            <View style={styles.payslipDetailRow}>
                                <Text style={styles.payslipDetailLabel}>Net Pay</Text>
                                <Text style={styles.payslipDetailValue}>{selectedPayslip.amount}</Text>
                            </View>

                            <View style={styles.payslipDetailSection}>
                                <Text style={styles.payslipDetailSectionTitle}>Earnings</Text>
                                <View style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>Basic Salary</Text>
                                    <Text style={styles.payslipDetailValue}>$4,000.00</Text>
                                </View>
                                <View style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>Bonus</Text>
                                    <Text style={styles.payslipDetailValue}>$500.00</Text>
                                </View>
                                <View style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>Overtime</Text>
                                    <Text style={styles.payslipDetailValue}>$500.00</Text>
                                </View>
                                <View style={[styles.payslipDetailRow, styles.payslipDetailTotal]}>
                                    <Text style={styles.payslipDetailTotalLabel}>Total Earnings</Text>
                                    <Text style={styles.payslipDetailTotalValue}>$5,000.00</Text>
                                </View>
                            </View>

                            <View style={styles.payslipDetailSection}>
                                <Text style={styles.payslipDetailSectionTitle}>Deductions</Text>
                                <View style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>Income Tax</Text>
                                    <Text style={styles.payslipDetailValue}>$500.00</Text>
                                </View>
                                <View style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>Health Insurance</Text>
                                    <Text style={styles.payslipDetailValue}>$150.00</Text>
                                </View>
                                <View style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>Retirement</Text>
                                    <Text style={styles.payslipDetailValue}>$100.00</Text>
                                </View>
                                <View style={[styles.payslipDetailRow, styles.payslipDetailTotal]}>
                                    <Text style={styles.payslipDetailTotalLabel}>Total Deductions</Text>
                                    <Text style={styles.payslipDetailTotalValue}>$750.00</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity
                                style={styles.viewPdfButton}
                                onPress={() => setShowPdf(true)}
                            >
                                <Feather name="file-text" size={16} color="#fff" />
                                <Text style={styles.viewPdfButtonText}>View PDF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={handleSharePayslip}
                            >
                                <Feather name="share-2" size={16} color="#fff" />
                                <Text style={styles.shareButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )
            ) : (
                <FlatList
                    data={filteredPayslips}
                    renderItem={renderPayslipItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.payslipsList}
                    ListHeaderComponent={
                        <View style={styles.filterContainer}>
                            <Text style={styles.filterLabel}>Filter by:</Text>
                            <View style={styles.filterButtons}>
                                <TouchableOpacity
                                    style={[styles.filterButton, filterYear === 'All' && styles.filterButtonActive]}
                                    onPress={() => setFilterYear('All')}
                                >
                                    <Text style={filterYear === 'All' ? styles.filterButtonTextActive : styles.filterButtonText}>
                                        All
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterButton, filterYear === '2025' && styles.filterButtonActive]}
                                    onPress={() => setFilterYear('2025')}
                                >
                                    <Text style={filterYear === '2025' ? styles.filterButtonTextActive : styles.filterButtonText}>
                                        2025
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterButton, filterYear === '2024' && styles.filterButtonActive]}
                                    onPress={() => setFilterYear('2024')}
                                >
                                    <Text style={filterYear === '2024' ? styles.filterButtonTextActive : styles.filterButtonText}>
                                        2024
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    filterContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    filterLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    filterButtons: {
        flexDirection: 'row',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f3f4f6',
    },
    filterButtonActive: {
        backgroundColor: '#4f46e5',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#4b5563',
    },
    filterButtonTextActive: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    payslipsList: {
        paddingBottom: 20,
    },
    payslipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    payslipIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#ede9fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    payslipContent: {
        flex: 1,
    },
    payslipTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    payslipDate: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    payslipAmountContainer: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    payslipAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    payslipStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    payslipStatusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
        marginRight: 4,
    },
    payslipStatus: {
        fontSize: 12,
        color: '#10b981',
    },
    payslipDetailContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4f46e5',
        marginLeft: 8,
    },
    payslipDetailHeader: {
        padding: 16,
        paddingTop: 0,
    },
    payslipDetailTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    payslipDetailDate: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    payslipDetailCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    payslipDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    payslipDetailLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    payslipDetailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    payslipDetailSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    payslipDetailSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    payslipDetailTotal: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    payslipDetailTotalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    payslipDetailTotalValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 16,
    },
    viewPdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginRight: 8,
    },
    viewPdfButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginLeft: 8,
    },
    shareButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    pdfViewerContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    pdfContainer: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    pdfHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#f9fafb',
    },
    pdfHeaderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
    },
    pdfContent: {
        flex: 1,
        padding: 16,
    },
    pdfPlaceholder: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 16,
        minHeight: 500,
    },
    pdfCompanyHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    pdfCompanyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    pdfDocumentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4f46e5',
        marginBottom: 4,
    },
    pdfPeriod: {
        fontSize: 14,
        color: '#6b7280',
    },
    pdfEmployeeInfo: {
        flexDirection: 'row',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 4,
        padding: 12,
    },
    pdfInfoColumn: {
        flex: 1,
    },
    pdfInfoLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    pdfInfoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 8,
    },
    pdfTable: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 4,
    },
    pdfTableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    pdfTableHeaderText: {
        fontWeight: '600',
        color: '#111827',
    },
    pdfTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    pdfTableCell: {
        flex: 1,
        padding: 8,
        fontSize: 14,
        color: '#4b5563',
    },
    pdfTableTotal: {
        backgroundColor: '#f9fafb',
    },
    pdfTableTotalText: {
        fontWeight: '600',
        color: '#111827',
    },
    pdfNetPay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4f46e5',
        padding: 16,
        borderRadius: 4,
        marginTop: 16,
    },
    pdfNetPayLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    pdfNetPayAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    pdfActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        backgroundColor: '#f9fafb',
    },
    pdfActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    pdfActionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4f46e5',
        marginLeft: 8,
    },
});
