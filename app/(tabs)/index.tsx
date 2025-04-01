"use client"

import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { Clock, LogIn, LogOut, Calendar, User, DollarSign, MessageSquare } from "lucide-react-native"
import { useRouter } from "expo-router"

// Sample recent attendance data
const recentAttendance = [
  {
    id: "1",
    date: "Today",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    duration: "8h 30m",
    status: "on-time",
  },
  {
    id: "2",
    date: "Yesterday",
    checkIn: "09:15 AM",
    checkOut: "06:00 PM",
    duration: "8h 45m",
    status: "late",
  },
  {
    id: "3",
    date: "Mon, Mar 18",
    checkIn: "08:55 AM",
    checkOut: "05:45 PM",
    duration: "8h 50m",
    status: "on-time",
  },
  {
    id: "4",
    date: "Fri, Mar 15",
    checkIn: "09:05 AM",
    checkOut: "05:30 PM",
    duration: "8h 25m",
    status: "on-time",
  },
]

export default function AttendanceHomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const handleLogout = () => {
    console.log("logout clicked")
    router.replace("/login")
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (isCheckedIn && checkInTime) {
        setElapsedTime(Math.floor((new Date().getTime() - checkInTime.getTime()) / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isCheckedIn, checkInTime])

  const handleCheckIn = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    setCheckInTime(now)
    setCheckOutTime(null)
    setElapsedTime(0)
    setIsCheckedIn(true)
    setLastAction(`Checked in at ${timeString}`)
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    setCheckOutTime(now)
    setElapsedTime(Math.floor((now.getTime() - (checkInTime?.getTime() || 0)) / 1000))
    setIsCheckedIn(false)
    setLastAction(`Checked out at ${timeString}`)
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(2, "0")}m : ${String(seconds).padStart(2, "0")}s`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "#059669"
      case "late":
        return "#DC2626"
      default:
        return "#6B7280"
    }
  }

  const navigateToScreen = (screen: string) => {
    console.log(`Navigating to ${screen}`)
    // In a real app, you would navigate to the appropriate screen
    // router.push(`/${screen}`);
  }

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View className="flex-row bg-red">
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Attendance</Text>
            <Text style={styles.subtitle}>
              {currentTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Text>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handleLogout}>
            <LogOut size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Clock Section */}
      <View style={styles.timeClockSection}>
        <View style={styles.timeCard}>
          <View>
            <Text style={styles.timeText}>
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
            </Text>
            {lastAction && <Text style={styles.lastActionText}>{lastAction}</Text>}
          </View>

          {/* Timer Display */}
          {isCheckedIn ? (
            <Text style={[styles.elapsedTimeText, { color: "#059669" }]}>{formatTime(elapsedTime)}</Text>
          ) : (
            checkOutTime && (
              <Text style={[styles.elapsedTimeText, { color: "#DC2626" }]}>Total Time: {formatTime(elapsedTime)}</Text>
            )
          )}

          {/* Separate Check In/Out Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleCheckIn}
              style={[styles.checkInButton, isCheckedIn && styles.disabledButton, { flex: 1, marginRight: 8 }]}
              disabled={isCheckedIn}
            >
              {!isCheckedIn && <LogIn size={20} color="white" />}
              {isCheckedIn ? (
                <Text style={styles.timerButtonText}>{formatTime(elapsedTime)}</Text>
              ) : (
                <Text style={styles.buttonText}>Check In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCheckOut}
              style={[styles.checkOutButton, !isCheckedIn && styles.disabledButton, { flex: 1, marginLeft: 8 }]}
              disabled={!isCheckedIn}
            >
              <LogOut size={20} color="white" />
              <Text style={styles.buttonText}>Check Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateToScreen("attendance")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#EEF2FF" }]}>
                <Calendar size={24} color="#4F46E5" />
              </View>
              <Text style={styles.quickActionText}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateToScreen("payroll")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#F0FDF4" }]}>
                <DollarSign size={24} color="#059669" />
              </View>
              <Text style={styles.quickActionText}>Payroll</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateToScreen("messages")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#EFF6FF" }]}>
                <MessageSquare size={24} color="#3B82F6" />
              </View>
              <Text style={styles.quickActionText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateToScreen("profile")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#FEF2F2" }]}>
                <User size={24} color="#DC2626" />
              </View>
              <Text style={styles.quickActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Clock size={20} color="#4F46E5" />
            <Text style={styles.statValue}>42.5</Text>
            <Text style={styles.statLabel}>Hours this week</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color="#6366F1" />
            <Text style={styles.statValue}>21</Text>
            <Text style={styles.statLabel}>Days this month</Text>
          </View>
        </View>

        {/* Recent Attendance Section */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {recentAttendance.map((record) => (
            <View key={record.id} style={styles.attendanceCard}>
              <View style={styles.attendanceHeader}>
                <Text style={styles.attendanceDate}>{record.date}</Text>
                <Text style={[styles.attendanceStatus, { color: getStatusColor(record.status) }]}>
                  {record.status === "on-time" ? "On Time" : "Late"}
                </Text>
              </View>
              <View style={styles.attendanceDetails}>
                <View style={styles.timeDetail}>
                  <LogIn size={16} color="#4F46E5" />
                  <Text style={styles.timeDetailText}>{record.checkIn}</Text>
                </View>
                <View style={styles.timeDetail}>
                  <LogOut size={16} color="#DC2626" />
                  <Text style={styles.timeDetailText}>{record.checkOut}</Text>
                </View>
                <View style={styles.timeDetail}>
                  <Clock size={16} color="#059669" />
                  <Text style={styles.timeDetailText}>{record.duration}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  timeClockSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  timeCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 24,
  },
  timeText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  lastActionText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  elapsedTimeText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
  },
  checkOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#DC2626",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  timerButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "semibold",

  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  recentSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  attendanceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  attendanceDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  attendanceStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  attendanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeDetailText: {
    marginLeft: 6,
    color: "#4B5563",
    fontSize: 14,
  },
})

