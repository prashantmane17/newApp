import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Platform,
    Dimensions,
    Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageAccessFramework } from 'expo-file-system';

const { width } = Dimensions.get('window');

export default function PayslipsScreen() {
    const { email, salMonth } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [empDetails, setEmpDetails] = useState<any>({});
    const router = useRouter();
    const [totalEarnings, setTotalEarnings] = useState(0);
    const loadPayDetails = async () => {
        setDataLoading(true)
        const response = await fetch(`http://192.168.1.25:8080/fetching-payslip-mobile?email=${email}&month=${salMonth}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const data = await response.json()
            console.log("data---", data)
            setEmpDetails(data)
        }
        setDataLoading(false)
    }

    useEffect(() => {
        loadPayDetails();
    }, [email]);

    useEffect(() => {
        if (empDetails?.earnComponent) {
            const total = Object.values(empDetails.earnComponent).reduce(
                (acc: number, val) => acc + Number(val || 0),
                0
            );
            setTotalEarnings(total);
        } else {
            setTotalEarnings(0);
        }
    }, [empDetails?.earnComponent, dataLoading]);

    const generatePdfHtml = () => {
        return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              font-size: 12px;
              background-color: #fff;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              margin-bottom: 20px;
            }
            .company-name {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            .location {
              font-size: 14px;
              color: #666;
              margin-bottom: 20px;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin-bottom: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .info-item {
              display: flex;
            }
            .info-label {
              width: 150px;
              font-weight: 500;
              color: #666;
            }
            .info-value {
              font-weight: normal;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #f5f5f5;
              padding: 10px;
              text-align: left;
              font-weight: 600;
              color: #333;
              border-bottom: 1px solid #ddd;
            }
            td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #eee;
            }
            .total-row td {
              font-weight: bold;
              border-top: 1px solid #ddd;
            }
            .net-pay-section {
              background-color: #e8f5e9;
              padding: 15px;
              border-radius: 4px;
              margin-bottom: 20px;
              text-align: center;
            }
            .net-pay {
              font-size: 16px;
              font-weight: bold;
              color: #333;
            }
            .net-pay-words {
              font-style: italic;
              color: #666;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              color: #888;
              font-size: 11px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-name">${empDetails.orgName || "Vivo Technology"}</div>
              <div class="location">${empDetails.orgAddress || "Koramangala"}</div>
              <div class="title">Payslip for the month of ${empDetails.payMonth || "May 2025"}</div>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Employee Name</div>
                <div class="info-value">${empDetails.name || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">PF A/C Number</div>
                <div class="info-value">${empDetails.pfAccountNo || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Employee No</div>
                <div class="info-value">${empDetails.empNo || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">PAN</div>
                <div class="info-value">${empDetails.pan || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date Of Joining</div>
                <div class="info-value">${empDetails.doj || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">ESI Number</div>
                <div class="info-value">${empDetails.esiNo || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Department</div>
                <div class="info-value">${empDetails.department || "IT, Helpdesk"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Bank Account No</div>
                <div class="info-value">${empDetails.accNo || "--"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Pay Period</div>
                <div class="info-value">${empDetails.payPeriod || "May 2025"}</div>
              </div>
            </div>
            
            <table>
              <tr>
                <th style="width: 40%">EARNINGS</th>
                <th style="width: 15%">AMOUNT</th>
                <th style="width: 15%">YTD</th>
                <th style="width: 40%">DEDUCTIONS</th>
                <th style="width: 15%">AMOUNT</th>
                <th style="width: 15%">YTD</th>
              </tr>
              <tr>
                <td>Basic Salary</td>
                <td>${empDetails?.earnComponent?.["Basic Salary"] || '17,000.00'}</td>
                <td>${empDetails?.ytdEarn?.["Basic Salary"] || '17,000.00'}</td>
                <td>Health Insurance Premium</td>
                <td>2,000.00</td>
                <td>2,000.00</td>
              </tr>
              <tr>
                <td>House Rent Allowance</td>
                <td>${empDetails?.earnComponent?.["House Rent Allowance"] || '8,500.00'}</td>
                <td>${empDetails?.ytdEarn?.["House Rent Allowance"] || '8,500.00'}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Fixed</td>
                <td>${empDetails?.earnComponent?.["Fixed"] || '8,500.00'}</td>
                <td>${empDetails?.ytdEarn?.["Fixed"] || '8,500.00'}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Overtime Pay</td>
                <td>2,000.00</td>
                <td>2,000.00</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Travel Allowance</td>
                <td>2,000.00</td>
                <td>2,000.00</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr class="total-row">
                <td>Gross Earnings</td>
                <td>42,000.00</td>
                <td></td>
                <td>Total Deductions</td>
                <td>${empDetails.totalDeduction || '2,000.00'}</td>
                <td></td>
              </tr>
            </table>
            
            <div class="net-pay-section">
              <div class="net-pay">Total Net Pay ${empDetails.netpay || '₹40,000.00'} (Forty Thousand Only)</div>
              <div class="net-pay-words">**Total Net Payable = Gross Earnings - Total Deductions</div>
            </div>
            
            <div class="footer">
              --- This is a system-generated document ---
            </div>
          </div>
        </body>
      </html>
    `;
    };

    const downloadPdf = async () => {
        try {
            setLoading(true);

            const html = generatePdfHtml();
            const { uri } = await Print.printToFileAsync({ html });

            const fileName = `Payslip-${empDetails.payMonth || "May2025"}.pdf`;

            if (Platform.OS === 'android') {
                const storedDirectoryUri = await AsyncStorage.getItem('pdfDirectoryUri');

                let directoryUri = storedDirectoryUri;

                if (!directoryUri) {
                    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
                    if (!permissions.granted) {
                        Alert.alert('Permission Denied', 'Cannot access the file system');
                        setLoading(false);
                        return;
                    }

                    directoryUri = permissions.directoryUri;
                    await AsyncStorage.setItem('pdfDirectoryUri', directoryUri);
                }

                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                const fileUri = await StorageAccessFramework.createFileAsync(
                    directoryUri,
                    fileName,
                    'application/pdf'
                );

                await FileSystem.writeAsStringAsync(fileUri, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                Alert.alert('Success', `PDF saved successfully`);
            } else {
                await Sharing.shareAsync(uri, {
                    UTI: '.pdf',
                    mimeType: 'application/pdf',
                });
            }

            setLoading(false);
        } catch (error) {
            // console.error('Error generating PDF:', error);
            // Alert.alert('Error', 'Failed to generate PDF');
            setLoading(false);
        }
    };

    const sharePdf = async () => {
        try {
            setLoading(true);

            const html = generatePdfHtml();
            const { uri } = await Print.printToFileAsync({ html });

            const fileName = `Payslip-${empDetails.payMonth || "May2025"}.pdf`;
            const filePath = FileSystem.documentDirectory + fileName;

            await FileSystem.moveAsync({
                from: uri,
                to: filePath,
            });

            await Sharing.shareAsync(filePath, {
                UTI: '.pdf',
                mimeType: 'application/pdf',
            });

            setLoading(false);
        } catch (error) {
            // console.error('Error sharing PDF:', error);
            // Alert.alert('Error', 'Failed to share PDF');
            setLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Feather name="arrow-left" size={20} color="#4f46e5" />
                <Text style={styles.backButtonText}>Back to Payslips</Text>
            </TouchableOpacity>

            {dataLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <ScrollView style={styles.payslipDetailContainer}>
                    <View style={styles.payslipCard}>
                        {/* Header */}
                        <View style={styles.payslipHeader}>
                            <Text style={styles.companyName}>{empDetails.orgName || "Vivo Technology"}</Text>
                            <Text style={styles.companyLocation}>{empDetails.orgAddress || "Koramangala"}</Text>
                        </View>

                        {/* Title */}
                        <Text style={styles.payslipTitle}>
                            Payslip for the month of {empDetails.payMonth || "May 2025"}
                        </Text>

                        {/* Employee Info Grid */}
                        <View style={styles.infoGrid}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Employee Name</Text>
                                <Text style={styles.infoValue}>{empDetails.name || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>PF A/C Number</Text>
                                <Text style={styles.infoValue}>{empDetails.pfAccountNo || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Employee No</Text>
                                <Text style={styles.infoValue}>{empDetails.empNo || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>PAN</Text>
                                <Text style={styles.infoValue}>{empDetails.pan || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Date Of Joining</Text>
                                <Text style={styles.infoValue}>{empDetails.doj || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>ESI Number</Text>
                                <Text style={styles.infoValue}>{empDetails.esiNo || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Department</Text>
                                <Text style={styles.infoValue}>{empDetails.department || "IT, Helpdesk"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Bank Account No</Text>
                                <Text style={styles.infoValue}>{empDetails.accNo || "--"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Pay Period</Text>
                                <Text style={styles.infoValue}>{empDetails.payPeriod || "May 2025"}</Text>
                            </View>
                        </View>

                        {/* Earnings Table */}
                        <View style={styles.tableSection}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>EARNINGS</Text>
                                <Text style={styles.tableHeaderCell}>AMOUNT</Text>
                                <Text style={styles.tableHeaderCell}>YTD</Text>
                            </View>

                            {empDetails.earnComponent &&
                                Object.entries(empDetails.earnComponent).map(([key, value]) => (
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>{String(key)}</Text>
                                        <Text style={styles.tableCell}>{String(value)}</Text>
                                        <Text style={styles.tableCell}>{empDetails?.ytdEarn?.[key]}</Text>
                                    </View>
                                ))}

                            {empDetails.otherAllowanceComponent &&
                                Object.entries(empDetails.otherAllowanceComponent).map(([key, value]) => (
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>{String(key)}</Text>
                                        <Text style={styles.tableCell}>{String(value)}</Text>
                                        <Text style={styles.tableCell}>{empDetails?.ytdDeduct?.[key]}</Text>
                                    </View>
                                ))}

                            <View style={[styles.tableRow, styles.totalRow]}>
                                <Text style={[styles.tableCellTotal, { flex: 2 }]}>Gross Earnings</Text>
                                <Text style={styles.tableCellTotal}>{totalEarnings}</Text>
                                <Text style={styles.tableCellTotal}></Text>
                            </View>
                        </View>

                        {/* Deductions Table */}
                        <View style={styles.tableSection}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>DEDUCTIONS</Text>
                                <Text style={styles.tableHeaderCell}>AMOUNT</Text>
                                <Text style={styles.tableHeaderCell}>YTD</Text>
                            </View>
                            {empDetails.deductComponent &&
                                Object.entries(empDetails.deductComponent).map(([key, value]) => (
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>{String(key)}</Text>
                                        <Text style={styles.tableCell}>{String(value)}</Text>
                                        <Text style={styles.tableCell}>{empDetails?.ytdDeduct?.[key]}</Text>
                                    </View>
                                ))}

                            <View style={[styles.tableRow, styles.totalRow]}>
                                <Text style={[styles.tableCellTotal, { flex: 2 }]}>Total Deductions</Text>
                                <Text style={styles.tableCellTotal}>{empDetails.totalDeduction || "0.00"}</Text>
                                <Text style={styles.tableCellTotal}></Text>
                            </View>
                        </View>

                        <View style={styles.netPaySection}>
                            <Text style={styles.netPayText}>
                                Total Net Pay {empDetails.netpay || "₹0.00"} ({empDetails.netpayInWords})
                            </Text>
                            <Text style={styles.netPayNote}>
                                **Total Net Payable = Gross Earnings - Total Deductions
                            </Text>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                --- This is a system-generated document ---
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.downloadButton}
                            onPress={downloadPdf}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Feather name="download" size={18} color="#fff" />
                                    <Text style={styles.actionButtonText}>Download PDF</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={sharePdf}
                            disabled={loading}
                        >
                            <Feather name="share-2" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 25,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    payslipCard: {
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        padding: 20,
    },
    payslipHeader: {
        marginBottom: 20,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    companyLocation: {
        fontSize: 14,
        color: '#666',
    },
    payslipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    infoGrid: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoLabel: {
        width: 120,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    tableSection: {
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHeaderCell: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    totalRow: {
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tableCellTotal: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    netPaySection: {
        backgroundColor: '#e8f5e9',
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
        alignItems: 'center',
    },
    netPayText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    netPayNote: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 16,
        marginTop: 8,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        padding: 14,
        flex: 1,
        marginRight: 8,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7c3aed',
        borderRadius: 8,
        padding: 14,
        flex: 1,
        marginLeft: 8,
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
});