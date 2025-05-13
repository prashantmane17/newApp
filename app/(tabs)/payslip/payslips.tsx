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
    Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as IntentLauncher from 'expo-intent-launcher';
import { StorageAccessFramework } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PayslipsScreen() {
    const { data } = useLocalSearchParams();
    const [empSalary, setEmpSalary] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                // console.log("Parsed Data:", parsed);
                setEmpSalary(parsed);

                // Set current month and year
                const date = new Date();
                setMonth(date.toLocaleString('default', { month: 'long' }));
                setYear(date.getFullYear().toString());
            } catch (err) {
                // console.error("Failed to parse JSON:", err);
                // Alert.alert("Error", "Failed to load payslip data");
            }
        }
    }, [data]);

    const generatePdfHtml = () => {
        return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #4f46e5;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #4f46e5;
              margin-bottom: 5px;
            }
            .document-title {
              font-size: 18px;
              color: #666;
              margin-bottom: 5px;
            }
            .period {
              font-size: 16px;
              color: #888;
            }
            .employee-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .info-column {
              flex: 1;
            }
            .info-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 3px;
            }
            .info-value {
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 25px;
              border: 1px solid #eee;
              border-radius: 8px;
              overflow: hidden;
            }
            .section-title {
              font-size: 16px;
              font-weight: 600;
              padding: 12px 15px;
              background-color: #f0f4ff;
              color: #4f46e5;
              border-bottom: 1px solid #eee;
            }
            .section-content {
              padding: 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 12px 15px;
              border-bottom: 1px solid #eee;
            }
            .row:last-child {
              border-bottom: none;
            }
            .label {
              font-size: 14px;
              color: #555;
            }
            .value {
              font-size: 14px;
              font-weight: 500;
            }
            .total-row {
              background-color: #f0f4ff;
              font-weight: 600;
            }
            .net-pay {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px;
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
              color: white;
              border-radius: 8px;
              margin-top: 20px;
            }
            .net-pay-label {
              font-size: 16px;
              font-weight: bold;
            }
            .net-pay-value {
              font-size: 22px;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Portstay</div>
            <div class="document-title">Salary Slip</div>
            <div class="period">${month} ${year}</div>
          </div>
          
          <div class="employee-info">
            <div class="info-column">
              <div class="info-label">Employee Name</div>
              <div class="info-value">John Doe</div>
              
              <div class="info-label">Employee ID</div>
              <div class="info-value">EMP001</div>
            </div>
            
            <div class="info-column">
              <div class="info-label">Department</div>
              <div class="info-value">Engineering</div>
              
              <div class="info-label">Designation</div>
              <div class="info-value">Software Engineer</div>
            </div>
            
            <div class="info-column">
              <div class="info-label">Bank Account</div>
              <div class="info-value">XXXX1234</div>
              
              <div class="info-label">PAN</div>
              <div class="info-value">ABCDE1234F</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Earnings</div>
            <div class="section-content">
              <div class="row">
                <div class="label">Basic Salary</div>
                <div class="value">₹${empSalary.basicSal || 0}</div>
              </div>
              <div class="row">
                <div class="label">House Rent Allowance</div>
                <div class="value">₹${empSalary.hra || 0}</div>
              </div>
              <div class="row">
                <div class="label">Fixed Allowance</div>
                <div class="value">₹${empSalary.fixedAllow || 0}</div>
              </div>
              <div class="row total-row">
                <div class="label">Gross Pay</div>
                <div class="value">₹${empSalary.grossPay || 0}</div>
              </div>
            </div>
          </div>
          
          <div class="net-pay">
            <div class="net-pay-label">Net Pay</div>
            <div class="net-pay-value">₹${empSalary.monthlyCTC || 0}</div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>© ${year} Portstay. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
    };

    const downloadPdf = async () => {
        try {
            setLoading(true);

            const html = generatePdfHtml(); // Your HTML template
            const { uri } = await Print.printToFileAsync({ html });

            const fileName = `Payslip-${month}-${year}.pdf`;

            if (Platform.OS === 'android') {
                // Try fetching the directory URI from AsyncStorage
                const storedDirectoryUri = await AsyncStorage.getItem('pdfDirectoryUri');

                let directoryUri = storedDirectoryUri;

                if (!directoryUri) {
                    // Request permissions and ask user to select the folder
                    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
                    if (!permissions.granted) {
                        Alert.alert('Permission Denied', 'Cannot access the file system');
                        setLoading(false);
                        return;
                    }

                    directoryUri = permissions.directoryUri;

                    // Save the selected directory URI for future use
                    await AsyncStorage.setItem('pdfDirectoryUri', directoryUri);
                }

                // Now that we have the directory URI, create and write to the file
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
                // iOS fallback: Share the file on iOS
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

            // Generate PDF
            const html = generatePdfHtml();
            const { uri } = await Print.printToFileAsync({ html });

            // Set the custom name for the PDF file
            const month = "May"; // Replace with actual month
            const year = "2025"; // Replace with actual year
            const fileName = `Payslip-${month}-${year}.pdf`;

            // Get a temporary directory for the file (or use a folder of your choice)
            const filePath = FileSystem.documentDirectory + fileName;

            // Rename the generated PDF to the desired name
            await FileSystem.moveAsync({
                from: uri,
                to: filePath,
            });

            // Now share the renamed file
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
            <ScrollView style={styles.payslipDetailContainer}>
                <View
                    style={styles.backButton}
                >
                    <TouchableOpacity onPress={() => router.back()}>

                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.backButtonText}>Salary Details</Text>
                </View>

                {/* <View style={styles.payslipDetailHeader}>  
                    <Text style={styles.payslipDetailTitle}>
                        Salary Details
                    </Text>
                     <Text style={styles.payslipDetailDate}>
                        Generated on {new Date().toLocaleDateString()}
                    </Text>
                </View> */}

                <View style={styles.payslipDetailCard}>
                    <LinearGradient
                        colors={['#4f46e5', '#7c3aed']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.netPayCard}
                    >
                        <View>
                            <Text style={styles.netPayLabel}>Net Pay</Text>
                            <Text style={styles.netPayValue}>₹{empSalary.monthlyCTC || 0}</Text>
                        </View>
                        <View style={styles.netPayIcon}>
                            <Feather name="credit-card" size={24} color="white" />
                        </View>
                    </LinearGradient>

                    {/* <View style={styles.employeeInfoCard}>
                        <View style={styles.employeeInfoRow}>
                            <View style={styles.employeeInfoItem}>
                                <Text style={styles.employeeInfoLabel}>Employee ID</Text>
                                <Text style={styles.employeeInfoValue}>EMP001</Text>
                            </View>
                            <View style={styles.employeeInfoItem}>
                                <Text style={styles.employeeInfoLabel}>Department</Text>
                                <Text style={styles.employeeInfoValue}>Engineering</Text>
                            </View>
                        </View>
                        <View style={styles.employeeInfoRow}>
                            <View style={styles.employeeInfoItem}>
                                <Text style={styles.employeeInfoLabel}>Pay Period</Text>
                                <Text style={styles.employeeInfoValue}>{month} {year}</Text>
                            </View>
                            <View style={styles.employeeInfoItem}>
                                <Text style={styles.employeeInfoLabel}>Pay Date</Text>
                                <Text style={styles.employeeInfoValue}>{new Date().toLocaleDateString()}</Text>
                            </View>
                        </View>
                    </View> */}

                    <View style={styles.payslipDetailSection}>
                        <View style={styles.sectionHeader}>
                            <Feather name="dollar-sign" size={18} color="#4f46e5" />
                            <Text style={styles.payslipDetailSectionTitle}>Earnings</Text>
                        </View>
                        <View style={styles.payslipDetailRow}>
                            <Text style={styles.payslipDetailLabel}>Basic Salary</Text>
                            <Text style={styles.payslipDetailValue}>₹{empSalary.basicSal || 0}</Text>
                        </View>
                        <View style={styles.payslipDetailRow}>
                            <Text style={styles.payslipDetailLabel}>House Rent Allowance</Text>
                            <Text style={styles.payslipDetailValue}>₹{empSalary.hra || 0}</Text>
                        </View>
                        {empSalary.customizeEarn &&
                            Object.entries(empSalary.customizeEarn).map(([key, value]) => (
                                <View key={key} style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>{String(key)}</Text>
                                    <Text style={styles.payslipDetailValue}>₹{String(value)}</Text>
                                </View>
                            ))}
                        <View style={styles.payslipDetailRow}>
                            <Text style={styles.payslipDetailLabel}>Fixed Allowance</Text>
                            <Text style={styles.payslipDetailValue}>₹{empSalary.fixedAllow || 0}</Text>
                        </View>
                        {empSalary.customizeReimburse && Object.keys(empSalary.customizeReimburse).length > 0 && (
                            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                                <Feather name="dollar-sign" size={18} color="#4f46e5" />
                                <Text style={styles.payslipDetailSectionTitle}>Other Allowances</Text>
                            </View>
                        )}
                        {empSalary.customizeReimburse &&
                            Object.entries(empSalary.customizeReimburse).map(([key, value]) => (
                                <View key={key} style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>{String(key)}</Text>
                                    <Text style={styles.payslipDetailValue}>₹{String(value)}</Text>
                                </View>
                            ))}
                        <View style={[styles.payslipDetailRow, styles.payslipDetailTotal]}>
                            <Text style={styles.payslipDetailTotalLabel}>Gross Pay</Text>
                            <Text style={styles.payslipDetailTotalValue}>₹{empSalary.monthlyCTC || 0}</Text>
                        </View>
                        {empSalary.customizeDeduct && Object.keys(empSalary.customizeDeduct).length > 0 && (

                            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                                <Feather name="dollar-sign" size={18} color="#4f46e5" />
                                <Text style={styles.payslipDetailSectionTitle}>Deduction</Text>
                            </View>

                        )}
                        {empSalary.customizeDeduct &&
                            Object.entries(empSalary.customizeDeduct).map(([key, value]) => (
                                <View key={key} style={styles.payslipDetailRow}>
                                    <Text style={styles.payslipDetailLabel}>{String(key)}</Text>
                                    <Text style={styles.payslipDetailValue}>₹{String(value)}</Text>
                                </View>
                            ))}
                        <View style={[styles.payslipDetailRow, styles.payslipDetailTotal]}>
                            <Text style={styles.payslipDetailTotalLabel}>Net Pay</Text>
                            <Text style={styles.payslipDetailTotalValue}>₹{empSalary.grossPay || 0}</Text>
                        </View>
                    </View>

                    {/* You can uncomment and use this section if needed
          <View style={styles.payslipDetailSection}>
            <View style={styles.sectionHeader}>
              <Feather name="minus-circle" size={18} color="#4f46e5" />
              <Text style={styles.payslipDetailSectionTitle}>Deductions</Text>
            </View>
            <View style={styles.payslipDetailRow}>
              <Text style={styles.payslipDetailLabel}>Income Tax</Text>
              <Text style={styles.payslipDetailValue}>₹500.00</Text>
            </View>
            <View style={styles.payslipDetailRow}>
              <Text style={styles.payslipDetailLabel}>Health Insurance</Text>
              <Text style={styles.payslipDetailValue}>₹150.00</Text>
            </View>
            <View style={styles.payslipDetailRow}>
              <Text style={styles.payslipDetailLabel}>Retirement</Text>
              <Text style={styles.payslipDetailValue}>₹100.00</Text>
            </View>
            <View style={[styles.payslipDetailRow, styles.payslipDetailTotal]}>
              <Text style={styles.payslipDetailTotalLabel}>Total Deductions</Text>
              <Text style={styles.payslipDetailTotalValue}>₹750.00</Text>
            </View>
          </View>
          */}
                </View>

                {/* <View style={styles.actionButtonsContainer}>
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
                </View> */}

                {/* <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        This is a computer-generated document.
                    </Text>
                    <Text style={styles.footerText}>
                        No signature is required.
                    </Text>
                </View> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#06607a",
        paddingTop: 25,
    },
    payslipDetailContainer: {
        flex: 1,
        backgroundColor: "#06607a",
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
    payslipDetailHeader: {
        padding: 16,
        paddingTop: 0,
    },
    payslipDetailTitle: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
    },
    payslipDetailDate: {
        fontSize: 14,
        color: '#f5f5f5',
        marginTop: 4,
    },
    payslipDetailCard: {
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    netPayCard: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    netPayLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    netPayValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    netPayIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    employeeInfoCard: {
        padding: 16,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    employeeInfoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    employeeInfoItem: {
        flex: 1,
    },
    employeeInfoLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    employeeInfoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    payslipDetailSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    payslipDetailSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 8,
    },
    payslipDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
    payslipDetailTotal: {
        marginTop: 8,
        paddingTop: 8,
        borderBottomWidth: 0,
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 6,
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
    footer: {
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
});