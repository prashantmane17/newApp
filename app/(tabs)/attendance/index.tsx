"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, StatusBar } from "react-native"
import { Feather } from "@expo/vector-icons"
import { parse, getDate } from 'date-fns';
import { router } from "expo-router";
import LeaveModal from "@/components/attendance/LeaveModal";

// Generate attendance data for a specific month and year
type RealEntry = {
  date: string; // format: "DD/MM/YYYY"
  start_time: string;
  end_time: string;
  name: string;
  username: string;
  work_hours: string;
}



const generateAttendanceData = (month: number, year: number, realData: any) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const data = []

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()

    const dateString = `${monthNames[month - 1]} ${day}, ${year}`
    const formattedRealDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`

    const realEntry = realData.find((item: any) => item.date === formattedRealDate)

    if (!realEntry) continue // Skip if no real data for the date

    const checkIn = realEntry.start_time || "-"
    const checkOut = realEntry.end_time || "-"
    const hours = realEntry.work_hours || "-"
    const status = "Present"

    data.push({
      id: `${year}-${month}-${day}`,
      date: dateString,
      day: dayNames[dayOfWeek],
      checkIn,
      checkOut,
      status,
      hours,
    })
  }

  return data
}

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Present":
      return "#10b981"
    case "Late":
      return "#f59e0b"
    case "Absent":
      return "#ef4444"
    case "Leave":
      return "#6366f1"
    case "Weekend":
      return "#9ca3af"
    default:
      return "#9ca3af"
  }
}

export default function AttendanceScreen() {
  interface Attend {
    id: string;
    checkIn: string;
    date: string;
    day: string;
    checkOut: string;
    hours: string;
    status: string;

  }
  const [view, setView] = useState("list") // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [attendanceData, setAttendanceData] = useState<Attend[]>([])
  const [empAttendance, setEmpAttendance] = useState<any>([])
  const [modalVisible, setModalVisible] = useState(false);


  // Calculate summary stats
  const [summary, setSummary] = useState({
    present: 0,
    late: 0,
    absent: 0,
    leave: 0,
  })

  // Update attendance data when month/year changes
  const loadSalary = async () => {
    const response = await fetch("http://192.168.1.25:8080/fetch-my-attendance-history-mobile", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json()
      console.log("jijojs---", data.attendanceHistory)
      setEmpAttendance(data.attendanceHistory)
    }

  }
  useEffect(() => {
    loadSalary();
  }, [])

  useEffect(() => {
    if (!empAttendance.length) return // Avoid running before data is loaded

    const data = generateAttendanceData(currentMonth, currentYear, empAttendance)
    setAttendanceData(data)

    // Calculate summary
    const present = data.filter((item) => item.status === "Present").length
    const late = data.filter((item) => item.status === "Late").length
    const absent = data.filter((item) => item.status === "Absent").length
    const leave = data.filter((item) => item.status === "Leave").length

    setSummary({ present, late, absent, leave })
  }, [currentMonth, currentYear, empAttendance])


  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Get month name
  const getMonthName = (month: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return monthNames[Number(month) - 1]
  }
  const handleLeaveModel = () => {

  }

  const renderAttendanceItem = ({ item }: { item: Attend }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.attendanceDate}>
        <Text style={styles.attendanceDay}>{item.day}</Text>
        <Text style={styles.attendanceDateText}>{item.date}</Text>
      </View>
      <View style={styles.attendanceDetails}>
        <View style={styles.attendanceTime}>
          <Text style={styles.attendanceTimeLabel}>Check In</Text>
          <Text style={styles.attendanceTimeValue}>{item.checkIn}</Text>
        </View>
        <View style={styles.attendanceTime}>
          <Text style={styles.attendanceTimeLabel}>Check Out</Text>
          <Text style={styles.attendanceTimeValue}>{item.checkOut}</Text>
        </View>
        <View style={styles.attendanceTime}>
          <Text style={styles.attendanceTimeLabel}>Hours</Text>
          <Text style={styles.attendanceTimeValue}>{item.hours}</Text>
        </View>
        <View style={styles.attendanceStatus}>
          <View style={[styles.attendanceStatusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.attendanceStatusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
    </View>
  )

  const renderCalendarView = () => {
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay()

    // Get number of days in month
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()

    // Create array of empty cells for days before the 1st of the month
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <View key={`empty-${i}`} style={styles.calendarDate} />
    ))

    // Create array of date cells
    const dateCells = Array.from({ length: daysInMonth }, (_, i) => {
      const date = i + 1
      const parsedDate = (rawDate: string) => {
        const day = parse(rawDate, 'MMMM d, yyyy', new Date());
        return getDate(day);
      }

      const dateData = attendanceData.find((item) => parsedDate(item.date) === date)

      const status = dateData?.status || "Unknown"
      // const status = "Unknown"


      // console.log("satays------", attendanceData)
      return (
        <View key={`date-${date}`} style={[styles.calendarDate, status === "Weekend" && styles.calendarWeekend]}>
          <Text style={styles.calendarDateText}>{date}</Text>
          {status !== "Unknown" && (
            <View style={[styles.calendarStatusDot, { backgroundColor: getStatusColor(status) }]} />
          )}
        </View>
      )
    })

    return (
      <View style={styles.calendarContainer}>

        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
        </View>
        <View style={styles.calendarGrid}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <View key={`day-${index}`} style={styles.calendarDay}>
              <Text style={styles.calendarDayText}>{day}</Text>
            </View>
          ))}

          {/* Empty cells for days before the 1st of the month */}
          {emptyCells}

          {/* Actual dates */}
          {dateCells}
        </View>

        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#6366f1" }]} />
            <Text style={styles.legendText}>Leave</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#008374" />
      <View style={styles.header}>
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.monthArrow} onPress={goToPreviousMonth}>
            <Feather name="chevron-left" size={20} color="#f5f5f5" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
          <TouchableOpacity style={styles.monthArrow} onPress={goToNextMonth}>
            <Feather name="chevron-right" size={20} color="#f5f5f5" />
          </TouchableOpacity>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewToggleButton, view === "list" && styles.viewToggleButtonActive]}
            onPress={() => setView("list")}
          >
            <Feather name="list" size={16} color={view === "list" ? "#fff" : "#4f46e5"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, view === "calendar" && styles.viewToggleButtonActive]}
            onPress={() => setView("calendar")}
          >
            <Feather name="calendar" size={16} color={view === "calendar" ? "#fff" : "#4f46e5"} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.leaveButtonContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.leaveButton}
        >
          <Text style={styles.leaveText}>Apply Leaves</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/attendance/leave")}
          style={styles.leaveButton}
        >
          <Text style={styles.leaveText}>My Leaves</Text>
        </TouchableOpacity>
      </View>

      <LeaveModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.present}</Text>
          <Text style={[styles.summaryLabel, { color: "#10b981" }]}>Present</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.absent}</Text>
          <Text style={[styles.summaryLabel, { color: "#ef4444" }]}>Absent</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.leave}</Text>
          <Text style={[styles.summaryLabel, { color: "#6366f1" }]}>Leave</Text>
        </View>
      </View>

      {view === "list" ? (
        <View style={styles.listView}>
          <FlatList
            data={attendanceData}
            renderItem={renderAttendanceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.attendanceList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No attendance records found.</Text>
            }
          />
        </View>
      ) : (
        <ScrollView>{renderCalendarView()}</ScrollView>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06607a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#008374",

  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthArrow: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginHorizontal: 8,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: "#4f46e5",
  },
  leaveButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    margin: 10,
  },
  leaveButton: {
    backgroundColor: '#00a896', // A teal-green button color for contrast
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
    // alignSelf: 'flex-end',
    marginRight: 10,
    elevation: 3, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  leaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  summary: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    margin: 8,
    borderRadius: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  listView: {
    margin: 8,
  },
  attendanceList: {
    paddingBottom: 20,
    borderRadius: 10,


  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  attendanceItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 4,
    padding: 16,
    borderRadius: 10,
  },
  attendanceDate: {
    width: 80,
  },
  attendanceDay: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  attendanceDateText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  attendanceDetails: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attendanceTime: {
    width: "33%",

  },
  attendanceTimeLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  attendanceTimeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 2,
  },
  attendanceStatus: {
    flexDirection: "row",
    alignItems: "center",

  },
  attendanceStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  attendanceStatusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 10,
  },
  calendarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  calendarDay: {
    width: "14.28%",
    paddingVertical: 8,
    alignItems: "center",
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  calendarDate: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  calendarWeekend: {
    backgroundColor: "#f9fafb",
  },
  calendarDateText: {
    fontSize: 14,
    color: "#111827",
  },
  calendarStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  calendarLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#6b7280",
  },
})

