import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Platform, Pressable,
    Alert
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/context/ContextSession';
type LeaveModalProps = {
    visible: boolean;
    onClose: () => void;
};
export default function LeaveModal({ visible, onClose }: LeaveModalProps) {
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateText, setDateText] = useState('Start and end date');
    const [markedDates, setMarkedDates] = useState({});
    const [calendarKey, setCalendarKey] = useState(1);
    const { sessionData } = useSession();

    // Get today's date in YYYY-MM-DD format
    const getTodayString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Function to determine if a date is in the past
    const isDateBeforeToday = (date: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        return compareDate < today;
    };

    // Handle date selection
    const handleDayPress = (day: any) => {
        // Prevent selecting dates in the past
        if (isDateBeforeToday(day.dateString)) {
            return;
        }

        // If no date is selected or both dates are selected, start fresh
        if (!startDate || (startDate && endDate)) {
            setStartDate(day.dateString);
            setEndDate('');

            // Mark the start date
            setMarkedDates({
                [day.dateString]: {
                    selected: true,
                    startingDay: true,
                    color: '#0077a2'
                }
            });
        }
        // If start date is selected but end date is not
        else if (startDate && !endDate) {
            // Ensure end date is not before start date
            if (day.dateString < startDate) {
                setStartDate(day.dateString);
                setMarkedDates({
                    [day.dateString]: {
                        selected: true,
                        startingDay: true,
                        color: '#0077a2'
                    }
                });
                return;
            }

            setEndDate(day.dateString);

            // Create date range markers
            const range = getDateRange(startDate, day.dateString);
            setMarkedDates(range);

            // Update the date text
            setDateText(`${formatDate(startDate)} - ${formatDate(day.dateString)}`);

            // Close calendar after selecting range
            setTimeout(() => {
                setShowCalendar(false);
            }, 500);
        }
    };

    // Format date for display
    const formatDate = (dateString: any) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Generate date range for marking
    type DateRangeValue = {
        selected: boolean;
        startingDay?: boolean;
        endingDay?: boolean;
        color: string;
    };
    const getDateRange = (start: any, end: any) => {
        const range: Record<string, DateRangeValue> = {};
        // const range = {};
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];

            if (dateString === start) {
                range[dateString] = {
                    selected: true,
                    startingDay: true,
                    color: '#0077a2'
                };
            } else if (dateString === end) {
                range[dateString] = {
                    selected: true,
                    endingDay: true,
                    color: '#0077a2'
                };
            } else {
                range[dateString] = {
                    selected: true,
                    color: '#0077a2'
                };
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return range;
    };

    // Reset form
    const resetForm = () => {
        setReason('');
        setComment('');
        setStartDate('');
        setEndDate('');
        setDateText('Start and end date');
        setMarkedDates({});
        setCalendarKey(prevKey => prevKey + 1);
    };

    function formatDateRange(start: string | Date, end: string | Date): string {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };

        const startFormatted = new Date(start).toLocaleDateString('en-GB', options);
        const endFormatted = new Date(end).toLocaleDateString('en-GB', options);

        return `${startFormatted} - ${endFormatted}`;
    }

    // Handle form submission
    const handleSubmit = async () => {

        if (!reason.trim()) {
            alert('Please enter a reason for leave');
            return;
        }

        if (!startDate || !endDate) {
            alert('Please select a leave period');
            return;
        }
        const leaveRequest = {
            reason,
            startDate,
            endDate,
            comment
        };

        const formData = new FormData();

        formData.append('taskType', "timeOff");
        formData.append('taskName', reason);
        formData.append('status', "pending");
        formData.append('teamId', sessionData?.teamId);
        formData.append('follow_Date', formatDateRange(startDate, endDate));
        formData.append('description', comment);
        try {
            const response = await fetch('https://www.portstay.com/add-holidays-list', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
            } else {
            }
        } catch (error) {
        }
        resetForm();
        onClose();
    };

    // Reset form when modal is closed
    useEffect(() => {
        if (!visible) {
            resetForm();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Leave Request</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Form Content */}
                        <View style={styles.formContent}>
                            {/* Reason Field */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Reason</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Reason for leave"
                                    value={reason}
                                    onChangeText={setReason}
                                />
                            </View>

                            {/* Leave Period Field */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Leave Period</Text>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={() => setShowCalendar(!showCalendar)}
                                >
                                    <Text style={[
                                        styles.dateText,
                                        (startDate && endDate) ? styles.dateTextActive : null
                                    ]}>
                                        {dateText}
                                    </Text>
                                    <Ionicons name="calendar" size={20} color="#777" />
                                </TouchableOpacity>

                                {/* Calendar */}
                                <Modal
                                    visible={showCalendar}
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => setShowCalendar(false)}
                                >
                                    <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
                                        <View style={styles.modalBackdrop}>
                                            {/* Prevent closing when tapping inside the content */}
                                            <Pressable onPress={() => { }} style={styles.modalContent}>
                                                {/* Close Button */}
                                                <TouchableOpacity onPress={() => setShowCalendar(false)} style={styles.modelCloseButton}>
                                                    <Ionicons name="close" size={24} color="white" />
                                                </TouchableOpacity>

                                                {/* Calendar */}
                                                <Calendar
                                                    key={calendarKey}
                                                    minDate={getTodayString()}
                                                    markedDates={markedDates}
                                                    markingType="period"
                                                    onDayPress={handleDayPress}
                                                    theme={{
                                                        todayTextColor: '#0077a2',
                                                        selectedDayBackgroundColor: '#0077a2',
                                                        selectedDayTextColor: '#ffffff',
                                                        textDisabledColor: '#d9e1e8',
                                                        arrowColor: '#0077a2',
                                                    }}
                                                />
                                            </Pressable>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>
                            </View>

                            {/* Comment Field */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Comment</Text>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder=""
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Footer Buttons */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButtonFooter}
                                onPress={onClose}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContent: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 16,
        color: '#999',
    },
    dateTextActive: {
        color: '#333',
    },
    calendarContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modelCloseButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
        height: 100,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    submitButton: {
        backgroundColor: '#0077a2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        marginRight: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButtonFooter: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    closeButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
});