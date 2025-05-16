"use client"

import { useEffect, useState } from "react"
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
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as Print from "expo-print"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageAccessFramework } from "expo-file-system"

const { width } = Dimensions.get("window")

export default function PayslipScreen() {
    const { email, salMonth } = useLocalSearchParams()
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)
    const [empDetails, setEmpDetails] = useState<any>({})
    const router = useRouter()

    const loadPayDetails = async () => {
        setDataLoading(true)
        try {
            // Dynamic data fetching from API
            const response = await fetch(
                `http://192.168.1.25:8080/fetching-payslip-mobile?email=${email}&month=${salMonth}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                },
            )

            if (response.ok) {
                const data = await response.json()
                console.log("data---", data)
                setEmpDetails(data)
            } else {
                Alert.alert("Error", "Failed to load payslip details")
            }
            setDataLoading(false)
        } catch (error) {
            console.error("Error loading pay details:", error)
            setDataLoading(false)
            Alert.alert("Error", "Failed to load payslip details")
        }
    }

    useEffect(() => {
        loadPayDetails()
    }, [email])

    const generatePdfHtml = () => {
        let earningsRows = ""
        const earnEntries = Object.entries(empDetails?.earnComponent || {})
        const deductEntries = Object.entries(empDetails?.deductComponent || {})
        const maxLength = Math.max(earnEntries.length, deductEntries.length)

        for (let i = 0; i < maxLength; i++) {
            const [earnKey, earnVal] = earnEntries[i] || ["", ""]
            const ytdEarnVal = empDetails?.ytdEarn?.[earnKey] || earnVal

            const [deductKey, deductVal] = deductEntries[i] || ["", ""]
            const ytdDeductVal = empDetails?.ytdDeduct?.[deductKey] || deductVal

            earningsRows += `
        <tr>
          <td>${earnKey}</td>
          <td>${earnVal}</td>
          <td>${ytdEarnVal}</td>
          <td>${deductKey}</td>
          <td>${deductVal}</td>
          <td>${ytdDeductVal}</td>
        </tr>
      `
        }

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
              text-align: left;
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
            .summary-table {
              width: 100%;
              margin-top: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .summary-label {
              font-weight: bold;
            }
            .summary-value {
              text-align: right;
            }
            .total-net {
              font-size: 16px;
              font-weight: bold;
              color: #000;
              margin-top: 10px;
              border-top: 1px solid #000;
              padding-top: 5px;
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
              <div class="title">Payslip For The Month Of ${empDetails.payMonth || "--"}</div>
            </div>
            
            <div class="employee-info">
              <div class="info-column right-border">
                <div class="info-row">
                  <div class="info-label">Employee Name</div>
                  <div class="info-value">: ${empDetails.name || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Employee No</div>
                  <div class="info-value">: ${empDetails.empNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Date Of Joining</div>
                  <div class="info-value">: ${empDetails.doj || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Department</div>
                  <div class="info-value">: ${empDetails.department || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Pay Period</div>
                  <div class="info-value">: ${empDetails.payPeriod || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">PAN</div>
                  <div class="info-value">: ${empDetails.pan || "--"}</div>
                </div>
              </div>
              
              <div class="info-column">
                <div class="info-row">
                  <div class="info-label">PF A/C Number</div>
                  <div class="info-value">: ${empDetails.pfAccountNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">ESI Number</div>
                  <div class="info-value">: ${empDetails.esiNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Bank Account No</div>
                  <div class="info-value">: ${empDetails.accNo || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Paid Days</div>
                  <div class="info-value">: ${empDetails.paidDays || "--"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">LOP Days</div>
                  <div class="info-value">: ${empDetails.loseOP || "--"}</div>
                </div>
              </div>
            </div>
            
            <table>
              <tr>
                <th>EARNINGS</th>
                <th>AMOUNT</th>
                <th>YTD</th>
                <th>DEDUCTIONS</th>
                <th>AMOUNT</th>
                <th>YTD</th>
              </tr>
              ${earningsRows}
              <tr>
                <td><strong>Gross Earnings</strong></td>
                <td><strong>${empDetails.monthlyCTC || "0.00"}</strong></td>
                <td></td>
                <td><strong>Total Deductions</strong></td>
                <td><strong>${empDetails.totalDeduction || "0.00"}</strong></td>
                <td></td>
              </tr>
            </table>
            
            <div style="padding: 10px 20px;">
              <div class="summary-table">
                <div class="summary-row">
                  <div class="summary-label">Gross Earnings</div>
                  <div class="summary-value">${empDetails.grossEarnings || empDetails.monthlyCTC || "0.00"}</div>
                </div>
                <div class="summary-row">
                  <div class="summary-label">Total Deductions</div>
                  <div class="summary-value">${empDetails.totalDeduction || "0.00"}</div>
                </div>
                <div class="summary-row total-net">
                  <div class="summary-label">Total Net Payable</div>
                  <div class="summary-value">${empDetails.netpay || "0.00"}</div>
                </div>
              </div>
              
              <div style="margin-top: 15px; font-style: italic;">
                Total Net Payable ${empDetails.netpay || "0.00"} (${empDetails.netpayInWords || "--"})
              </div>
            </div>
            
            <div class="footer">
              --- This is A System-Generated Document ---
            </div>
          </div>
        </body>
      </html>
    `
    }

    const downloadPdf = async () => {
        try {
            setLoading(true)

            const html = generatePdfHtml()
            const { uri } = await Print.printToFileAsync({ html })

            const fileName = `Payslip-${empDetails.payMonth || "Payslip"}.pdf`

            if (Platform.OS === "android") {
                const storedDirectoryUri = await AsyncStorage.getItem("pdfDirectoryUri")

                let directoryUri = storedDirectoryUri

                if (!directoryUri) {
                    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync()
                    if (!permissions.granted) {
                        Alert.alert("Permission Denied", "Cannot access the file system")
                        setLoading(false)
                        return
                    }

                    directoryUri = permissions.directoryUri

                    // Save the selected directory URI for future use
                    await AsyncStorage.setItem("pdfDirectoryUri", directoryUri)
                }

                // Now that we have the directory URI, create and write to the file
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                })

                const fileUri = await StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/pdf")

                await FileSystem.writeAsStringAsync(fileUri, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                })

                Alert.alert("Success", `PDF saved successfully`)
            } else {
                // iOS fallback: Share the file on iOS
                await Sharing.shareAsync(uri, {
                    UTI: ".pdf",
                    mimeType: "application/pdf",
                })
            }

            setLoading(false)
        } catch (error) {
            console.error("Error generating PDF:", error)
            Alert.alert("Error", "Failed to generate PDF")
            setLoading(false)
        }
    }

    const sharePdf = async () => {
        try {
            setLoading(true)

            // Generate PDF
            const html = generatePdfHtml()
            const { uri } = await Print.printToFileAsync({ html })

            // Set the custom name for the PDF file
            const fileName = `Payslip-${empDetails.payMonth || "Payslip"}.pdf`

            // Get a temporary directory for the file (or use a folder of your choice)
            const filePath = FileSystem.documentDirectory + fileName

            // Rename the generated PDF to the desired name
            await FileSystem.moveAsync({
                from: uri,
                to: filePath,
            })

            // Now share the renamed file
            await Sharing.shareAsync(filePath, {
                UTI: ".pdf",
                mimeType: "application/pdf",
            })

            setLoading(false)
        } catch (error) {
            console.error("Error sharing PDF:", error)
            Alert.alert("Error", "Failed to share PDF")
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Feather name="arrow-left" size={20} color="#f5f5f5" />
                <Text style={styles.backButtonText}>Back to Payslips</Text>
            </TouchableOpacity>

            {dataLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.payslipCard}>
                        {/* Company Header */}
                        <View style={styles.companyHeader}>
                            <Text style={styles.companyName}>{empDetails.orgName}</Text>
                            <Text style={styles.companyLocation}>{empDetails.orgAddress}</Text>
                        </View>

                        {/* Payslip Title */}
                        <View style={styles.payslipTitleContainer}>
                            <Text style={styles.payslipTitle}>Payslip For The Month Of {empDetails.payMonth}</Text>
                        </View>

                        {/* Employee Details - Left Column */}
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailsColumn}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Employee Name</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.name}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Employee No</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.empNo}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date Of Joining</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails?.doj}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Department</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.department}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Pay Period</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.payPeriod}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>PAN</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.pan}</Text>
                                </View>
                            </View>

                            {/* Employee Details - Right Column */}
                            <View style={styles.detailsColumn}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>PF A/C Number</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.pfAccountNo}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>ESI Number</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.esiNo}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Bank Account No</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.accNo}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Paid Days</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.paidDays}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>LOP Days</Text>
                                    <Text style={styles.detailColon}>:</Text>
                                    <Text style={styles.detailValue}>{empDetails.loseOP}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Earnings and Deductions Table */}
                        <View style={styles.tableContainer}>
                            {/* Table Header */}
                            <View style={styles.tableRow}>
                                <View style={[styles.tableHeaderCell, { flex: 2 }]}>
                                    <Text style={styles.tableHeaderText}>EARNINGS</Text>
                                </View>
                                <View style={styles.tableHeaderCell}>
                                    <Text style={styles.tableHeaderText}>AMOUNT</Text>
                                </View>

                                <View style={styles.tableHeaderCell}>
                                    <Text style={styles.tableHeaderText}>YTD</Text>
                                </View>
                            </View>

                            {/* Table Rows - Dynamic based on earnings and deductions */}
                            {Object.keys(empDetails.earnComponent || {}).map((earnKey, index) => {
                                const deductKeys = Object.keys(empDetails.deductComponent || {})
                                const deductKey = index < deductKeys.length ? deductKeys[index] : ""

                                return (
                                    <View style={styles.tableRow} key={index}>
                                        <View style={[styles.tableCell, { flex: 2 }]}>
                                            <Text style={styles.tableCellText}>{earnKey}</Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={styles.tableCellText}>{empDetails.earnComponent[earnKey]}</Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={styles.tableCellText}>
                                                {empDetails.ytdEarn?.[earnKey] || empDetails.earnComponent[earnKey]}
                                            </Text>
                                        </View>

                                    </View>
                                )
                            })}
                            <View style={[styles.tableRow, styles.totalRow]}>
                                <View style={[styles.tableCell, { flex: 2 }]}>
                                    <Text style={styles.totalText}>Gross Earnings</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.totalText}>{empDetails.monthlyCTC}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableCellText}></Text>
                                </View>
                            </View>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableRow}>
                                    <View style={[styles.tableHeaderCell, { flex: 2 }]}>
                                        <Text style={styles.tableHeaderText}>DEDUCTIONS</Text>
                                    </View>
                                    <View style={styles.tableHeaderCell}>
                                        <Text style={styles.tableHeaderText}>AMOUNT</Text>
                                    </View>
                                    <View style={styles.tableHeaderCell}>
                                        <Text style={styles.tableHeaderText}>YTD</Text>
                                    </View>
                                </View>
                            </View>
                            {Object.keys(empDetails.deductComponent || {}).map((deductKey, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <View style={[styles.tableCell, { flex: 2 }]}>
                                        <Text style={styles.tableCellText}>{deductKey}</Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={styles.tableCellText}>{deductKey ? empDetails.deductComponent[deductKey] : ""}</Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={styles.tableCellText}>
                                            {deductKey ? empDetails.ytdDeduct?.[deductKey] || empDetails.deductComponent[deductKey] : ""}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                            {/* Table Footer - Totals */}
                            <View style={[styles.tableRow, styles.totalRow]}>
                                <View style={[styles.tableCell, { flex: 2 }]}>
                                    <Text style={styles.totalText}>Total Deductions</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.totalText}>{empDetails.totalDeduction}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableCellText}></Text>
                                </View>
                            </View>
                        </View>

                        {/* Summary Section */}
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Gross Earnings</Text>
                                <Text style={styles.summaryValue}>{empDetails.grossEarnings || empDetails.monthlyCTC}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total Deductions</Text>
                                <Text style={styles.summaryValue}>{empDetails.totalDeduction}</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.netPayRow]}>
                                <Text style={styles.netPayLabel}>Total Net Payable</Text>
                                <Text style={styles.netPayValue}>{empDetails.netpay}</Text>
                            </View>

                            <Text style={styles.netPayWords}>
                                Total Net Payable {empDetails.netpay} ({empDetails.netpayInWords})
                            </Text>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>--- This is A System-Generated Document ---</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={styles.downloadButton} onPress={downloadPdf} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Feather name="download" size={18} color="#fff" />
                                    <Text style={styles.actionButtonText}>Download PDF</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareButton} onPress={sharePdf} disabled={loading}>
                            <Feather name="share-2" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#06607a",
        paddingTop: Platform.OS === "ios" ? 50 : 25,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#008374",
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#f5f5f5",
        marginLeft: 8,
    },
    payslipCard: {
        margin: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    companyHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    companyName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    companyLocation: {
        fontSize: 14,
        color: "#666",
    },
    payslipTitleContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    payslipTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    detailsContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        padding: 12,
    },
    detailsColumn: {
        flex: 1,
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    detailLabel: {
        width: 110,
        fontSize: 12,
        color: "#666",
    },
    detailColon: {
        fontSize: 12,
        color: "#666",
        marginRight: 4,
    },
    detailValue: {
        flex: 1,
        fontSize: 12,
        color: "#333",
        fontWeight: "500",
    },
    tableContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    tableHeaderCell: {
        flex: 1,
        padding: 8,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },
    tableCell: {
        flex: 1,
        padding: 8,
        justifyContent: "center",
    },
    tableCellText: {
        fontSize: 12,
        color: "#333",
    },
    totalRow: {
        backgroundColor: "#f9f9f9",
    },
    totalText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },
    summaryContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: "#333",
    },
    summaryValue: {
        fontSize: 12,
        color: "#333",
        fontWeight: "500",
    },
    netPayRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    netPayLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    netPayValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    netPayWords: {
        fontSize: 12,
        fontStyle: "italic",
        color: "#666",
        marginTop: 8,
    },
    footer: {
        padding: 12,
        alignItems: "center",
    },
    footerText: {
        fontSize: 10,
        color: "#666",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 16,
        marginTop: 8,
    },
    downloadButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4f46e5",
        borderRadius: 8,
        padding: 14,
        flex: 1,
        marginRight: 8,
        shadowColor: "#4f46e5",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    shareButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7c3aed",
        borderRadius: 8,
        padding: 14,
        flex: 1,
        marginLeft: 8,
        shadowColor: "#7c3aed",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 8,
    },
})
