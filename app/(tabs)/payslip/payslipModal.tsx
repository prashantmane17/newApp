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
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageAccessFramework } from 'expo-file-system';

const { width } = Dimensions.get('window');

export default function PayslipsScreen() {
  const { email, salMonth } = useLocalSearchParams();
  console.log("email----", email, "---month---", salMonth)
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [empDetails, setEmpDetails] = useState<any>({

  });
  const router = useRouter();
  const loadPayDetails = async () => {
    setDataLoading(true)
    const response = await fetch(`http://192.168.1.25:8080/fetching-payslip-mobile?email=${email}&month=${salMonth}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("res-----", response)
    if (response.ok) {
      const data = await response.json()
      console.log("jio---", data)
      setEmpDetails(data)
    }
    setDataLoading(false)
  }
  useEffect(() => {
    loadPayDetails();
  }, [email])


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
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #000;
            }
            .header {
              padding: 10px 20px;
              border-bottom: 1px solid #000;
              text-align: right;
            }
            .company-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .location {
              font-size: 14px;
            }
            .title-section {
              padding: 10px 20px;
              border-bottom: 1px solid #000;
              text-align: center;
            }
            .title {
              font-size: 14px;
              font-weight: bold;
            }
            .employee-info {
              display: flex;
              border-bottom: 1px solid #000;
            }
            .info-column {
              flex: 1;
              padding: 10px 20px;
            }
            .info-row {
              display: flex;
              margin-bottom: 5px;
            }
            .info-label {
              width: 150px;
              font-weight: normal;
            }
            .info-value {
              flex: 1;
            }
            .attendance-section {
              padding: 10px 20px;
              border-bottom: 1px solid #000;
            }
            .attendance-title {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .attendance-details {
              display: flex;
            }
            .attendance-item {
              margin-right: 20px;
            }
            .earnings-section {
              display: flex;
              border-bottom: 1px solid #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .net-pay-section {
              padding: 10px 20px;
              border-bottom: 1px solid #000;
            }
            .net-pay {
              color: green;
              font-weight: bold;
              font-size: 14px;
            }
            .net-pay-words {
              font-style: italic;
              margin-top: 5px;
            }
            .footer {
              padding: 10px 20px;
              text-align: center;
              font-size: 10px;
            }
            .right-border {
              border-right: 1px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-name">${empDetails.orgName || "--"}</div>
              <div class="location">${empDetails.orgAddress || "--"}</div>
            </div>
            
            <div class="title-section">
              <div class="title">Pay Slip For ${empDetails.payslipMonth}</div>
            </div>
            
            <div class="employee-info">
              <div class="info-column right-border">
                <div class="info-row">
                  <div class="info-label">EmpNo</div>
                  <div class="info-value">${empDetails.empNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Name</div>
                  <div class="info-value">${empDetails.name}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Designation</div>
                  <div class="info-value">${empDetails.designation || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Date Of Joining</div>
                  <div class="info-value">${empDetails.doj || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Department</div>
                  <div class="info-value">${empDetails.department || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Pay Date</div>
                  <div class="info-value">${empDetails.payDate || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Pay Period</div>
                  <div class="info-value">${empDetails.payPeriod || "--"}</div>
                </div>
              </div>
              
              <div class="info-column">
                <div class="info-row">
                  <div class="info-label">PAN</div>
                  <div class="info-value">${empDetails.pan || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Bank A/c.No.</div>
                  <div class="info-value">${empDetails.accNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Location</div>
                  <div class="info-value">${empDetails.location || "--"}</div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">PF Account No.</div>
                  <div class="info-value">${empDetails.pfAccountNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">ESI No</div>
                  <div class="info-value">${empDetails.esiNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">CTC</div>
                  <div class="info-value">${empDetails.ctc}</div>
                </div>
              </div>
            </div>
            
            <div class="attendance-section">
              <div class="attendance-title">Attendance</div>
              <div class="attendance-details">
                <div class="attendance-item">Paid Days ${empDetails.paidDays}</div>
                <div class="attendance-item">LOP ${empDetails.loseOP}</div>
              </div>
            </div>
            
            <table>
              <tr>
                <th>Earnings</th>
                <th>Current Month</th>
                <th>YTD Earnings</th>
                <th>Deductions</th>
                <th>Current Month</th>
                <th>YTD Deductions</th>
              </tr>
              <tr>
                <td>Basic Salary</td>
                <td>${empDetails?.earnComponent["Basic Salary"] || '0.00'}</td>
                <td>${empDetails?.ytdEarn["Basic Salary"] || '0.00'}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>House Rent Allowance</td>
                <td>${empDetails?.earnComponent["House Rent Allowance"] || '0.00'}</td>
                <td>${empDetails?.ytdEarn["House Rent Allowance"] || '0.00'}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Fixed</td>
                <td>${empDetails?.earnComponent["Fixed"] || '0.00'}</td>
                <td>${empDetails?.ytdEarn["Fixed"] || '0.00'}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>${(
        parseFloat((empDetails.basicSalMonth || "0").replace(/,/g, "")) +
        parseFloat((empDetails.hra || "0").replace(/,/g, "")) +
        parseFloat((empDetails.fixedAllow || "0").replace(/,/g, ""))
      ).toFixed(2)}</strong></td>
                <td></td>
                <td><strong>Total Deductions</strong></td>
                <td><strong>${empDetails.totalDeduction || '0.00'}</strong></td>
                <td></td>
              </tr>
            </table>
            
            <div class="net-pay-section">
              <div class="net-pay">Net Pay : ${empDetails.netpay || '0.00'}</div>
              <div class="net-pay-words">${empDetails.netpayInWords || '0.00'}.</div>
            </div>
            
            <div class="footer">
              THIS IS A COMPUTER GENERATED STATEMENT - SIGNATURE NOT REQUIRED
            </div>
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

      const fileName = `Payslip-${empDetails.payMonth}.pdf`;

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
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
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
      const fileName = `Payslip-${empDetails.payMonth}.pdf`;

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
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Failed to share PDF');
      setLoading(false);
    }
  };
  // const basicSalary = Object.keys(empDetails.earnComponent)[0];
  // const fixedSalary = Object.keys(empDetails.earnComponent)[1];
  // const hraSalary = Object.keys(empDetails.earnComponent)[2];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Feather name="arrow-left" size={20} color="#4f46e5" />
        <Text style={styles.backButtonText}>Back to Payslips</Text>
      </TouchableOpacity>
      {dataLoading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#008374" />
      </View>) : (
        <ScrollView style={styles.payslipDetailContainer}>

          {/* Mobile View of Payslip */}
          <View style={styles.payslipCard}>
            <View style={styles.payslipHeader}>
              <View>
                <Text style={styles.companyName}>{empDetails.orgName}</Text>
                <Text style={styles.companyLocation}>{empDetails.orgAddress}</Text>
              </View>
            </View>

            <View style={styles.payslipTitle}>
              <Text style={styles.payslipTitleText}>Pay Slip For {empDetails.payMonth}</Text>
            </View>

            <View style={styles.employeeInfoSection}>
              <View style={styles.employeeInfoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>EmpNo</Text>
                  <Text style={styles.infoValue}>{empDetails.empNo}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{empDetails.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Designation</Text>
                  <Text style={styles.infoValue}>{empDetails.designation || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Department</Text>
                  <Text style={styles.infoValue}>{empDetails.department}</Text>
                </View>
              </View>

              <View style={styles.employeeInfoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Pay Date</Text>
                  <Text style={styles.infoValue}>{empDetails.payDate || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{empDetails.location || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CTC</Text>
                  <Text style={styles.infoValue}>{empDetails.ctc}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Pay Period</Text>
                  <Text style={styles.infoValue}>{empDetails.payPeriod || "--"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.attendanceSection}>
              <Text style={styles.sectionTitle}>Attendance</Text>
              <View style={styles.attendanceDetails}>
                <Text style={styles.attendanceItem}>Paid Days {empDetails.paidDays}</Text>
                <Text style={styles.attendanceItem}>LOP {empDetails.loseOP}</Text>
              </View>
            </View>

            <View style={styles.earningsSection}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Earnings</Text>
                <Text style={styles.tableHeaderCell}>Current Month</Text>
                <Text style={styles.tableHeaderCell}>YTD</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Basic Salary</Text>
                <Text style={styles.tableCell}>{empDetails?.earnComponent["Basic Salary"] || '0.00'}</Text>
                <Text style={styles.tableCell}>{empDetails?.ytdEarn["Basic Salary"] || '0.00'}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>House Rent Allowance</Text>
                <Text style={styles.tableCell}>{empDetails.earnComponent["House Rent Allowance"] || '0.00'}</Text>
                <Text style={styles.tableCell}>{empDetails.ytdEarn["House Rent Allowance"] || '0.00'}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Fixed</Text>
                <Text style={styles.tableCell}>{empDetails.earnComponent["Fixed"] || '0.00'}</Text>
                <Text style={styles.tableCell}>{empDetails.ytdEarn["Fixed"] || '0.00'}</Text>
              </View>

              <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={[styles.tableCellTotal, { flex: 2 }]}>Total</Text>
                <Text style={styles.tableCellTotal}>{(
                  parseFloat((empDetails.basicSalMonth || "0").replace(/,/g, "")) +
                  parseFloat((empDetails.hra || "0").replace(/,/g, "")) +
                  parseFloat((empDetails.fixedAllow || "0").replace(/,/g, ""))
                ).toFixed(2)}

                </Text>
                <Text style={styles.tableCellTotal}></Text>
              </View>
            </View>

            <View style={styles.deductionsSection}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Deductions</Text>
                <Text style={styles.tableHeaderCell}>Current Month</Text>
                <Text style={styles.tableHeaderCell}>YTD</Text>
              </View>

              <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={[styles.tableCellTotal, { flex: 2 }]}>Total Deductions</Text>
                <Text style={styles.tableCellTotal}>{empDetails.totalDeduction}</Text>
                <Text style={styles.tableCellTotal}></Text>
              </View>
            </View>

            <View style={styles.netPaySection}>
              <Text style={styles.netPayText}>Net Pay : {empDetails.netpay || '0.00'}</Text>
              <Text style={styles.netPayWords}>{empDetails.netpayInWords || '--'}</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                THIS IS A COMPUTER GENERATED STATEMENT - SIGNATURE NOT REQUIRED
              </Text>
            </View>
          </View>

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
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 25,
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  payslipHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  companyLocation: {
    fontSize: 14,
    color: '#666',
  },
  payslipTitle: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  payslipTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  employeeInfoSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 12,
  },
  employeeInfoColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 85,
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  attendanceSection: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  attendanceDetails: {
    flexDirection: 'row',
  },
  attendanceItem: {
    marginRight: 16,
    fontSize: 12,
    color: '#333',
  },
  earningsSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  totalRow: {
    backgroundColor: '#f9f9f9',
  },
  tableCellTotal: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  deductionsSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  netPaySection: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  netPayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  netPayWords: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#666',
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