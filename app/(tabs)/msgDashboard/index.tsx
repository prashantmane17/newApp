import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert, StatusBar, Modal } from 'react-native';
import { Users, MessageSquare, Building2, MessagesSquare, Timer, LogIn, LogOut, Clock, Plus, EllipsisVertical, Outdent, Building } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSession } from '@/context/ContextSession';
import moment from "moment"
import { ActivityIndicator } from 'react-native';
import { ChatMessage, connectSocket, subscribeToNotifications } from '@/hooks/sockets/socketService';


export default function ChatInterface() {
  const router = useRouter();
  const { sessionData, handleLogout } = useSession();
  const [messages, setMessages] = useState<any>({ user: [], team: [], group: [], company: [] });
  const [lastMessage, setLastMessage] = useState<any>({ user: [], team: [], group: [], company: [] });
  const [companyTeam, setCompanyTeam] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false);
  const [branchList, setBranchList] = useState<any>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleLogoutPress = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.replace('/(tabs)');
      }, 1500);
    } catch (error) {
      // Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const friendsList = async () => {
    console.log("juu")
    try {
      setLoading(true); // Start loading
      let url = "https://www.portstay.com/employee.chatUsers-mobile"
      if (sessionData?.role === "Superadmin") {
        url = "https://www.portstay.com/superadmin.chatUsers-Mobile"
      }
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("dataqqa---", data)
      setCompanyTeam(data.team || data.helpdesk || data.HumanResources || data.support);
      if (sessionData?.role === "Superadmin") {
        setBranchList(data.branchList)
      }
      const extractLastMessage = (list: any) => list?.map((msg: any) => msg.message?.slice(-1)[0] || '--');
      setLastMessage({
        user: extractLastMessage(data.friendList || data.superadminList),
        team: extractLastMessage(data.teamList),
        company: extractLastMessage(data.workingCompany)
      });
      setMessages({
        user: data.friendList || data.superadminList,
        team: data.teamList,
        group: data.portList,
        company: data.workingCompany
      });
    } catch (error) {
      // Alert.alert("error", "err." + error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      friendsList();
      connectSocket(sessionData?.loginId, sessionData?.loginId, (newMessage: ChatMessage) => {
        console.log("newMessage----", newMessage)
      }, (notification: any) => {
        // friendsList();
        // console.log("notification----", notification)
        // const user = messages.user.find((user: any) => user.id === notification.fromUserId);
        // if (user) {
        //   console.log("user----", user.message[user.message.length - 1])
        //   user.numberOfUnSeenMessage = Number(user.numberOfUnSeenMessage) + 1;
        //   user.message.push(notification);
        //   setMessages({ ...messages, user: user });

        // }

      });
    }, [sessionData]));


  const formatMessageDate = (dateString: string) => {
    const date = moment(dateString)
    const today = moment().startOf("day")
    const yesterday = moment().subtract(1, "day").startOf("day")

    if (date.isSame(today, "day")) return "Today"
    if (date.isSame(yesterday, "day")) return "Yesterday"
    return date.format("DD MMMM YYYY")
  }
  const formatTime = (dateString: string) => moment(dateString).format("hh:mm A")

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return messages;

    const filterItems = (items: any[]) => {
      if (!items) return [];
      return items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.branch && item.branch.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    };

    return {
      user: filterItems(messages.user),
      team: filterItems(messages.team),
      group: filterItems(messages.group),
      company: filterItems(messages.company),
      branchList: filterItems(branchList)
    };
  }, [messages, branchList, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StatusBar barStyle="light-content" backgroundColor="#008374" />
      <View style={styles.header}>
        <View style={styles.headerContent}>

          <View style={styles.headerInfo}>
            <Text style={styles.headerSubtitle}>Messages & Groups</Text>
          </View>
          <TouchableOpacity onPress={handleLogoutPress} disabled={isLoggingOut}>
            <LogOut size={20} color='red' />
          </TouchableOpacity>

        </View>
      </View>
      {/* Loading Modal */}
      <Modal
        transparent={true}
        visible={isLoggingOut}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#008374" />
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        </View>
      </Modal>
      {/* Success Popup Modal */}
      <Modal
        transparent={true}
        visible={showSuccessPopup}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.successModalContent]}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successText}>Logged out successfully</Text>
          </View>
        </View>
      </Modal>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>




      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#008374" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {sessionData?.role !== "Superadmin" && (companyTeam?.teamname || companyTeam?.name) && (
            <TouchableOpacity style={styles.navItem} onPress={() => router.push({
              pathname: '/(tabs)/msgDashboard/messages/companyChat',
              params: {
                id: companyTeam?.portId || companyTeam?.id || 111, name: companyTeam?.name || "User", avatar: 'https://www.portstay.com/resources/img/Profile/default_group_image.png'
              }
            })}>
              <Users color="#fff" size={24} />
              <Text style={styles.navText}>{companyTeam?.teamname || companyTeam?.name || "teamname"}</Text>
            </TouchableOpacity>
          )}
          {sessionData?.role !== "Superadmin" && (
            filteredItems.team?.map((user: any, index: number) => (
              <TouchableOpacity key={user.userId} style={styles.chatPreview}
                onPress={() => router.push({
                  pathname: '/(tabs)/msgDashboard/messages/chat',
                  params: { id: user.id, name: user.name }
                })}>
                <Image
                  source={{ uri: 'https://www.portstay.com/resources/img/Profile/default_user_image.png' }}
                  style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                  <Text style={styles.chatName}>{user.name}</Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatMessage}>{lastMessage.team[index] === "--" ? '' : lastMessage.team[index].contents}</Text>
                </View>
                <View >
                  <Text style={styles.timestamp}>{lastMessage.team[index] === "--" ? '' : formatMessageDate(lastMessage.team[index].timeSent)}{"  "}</Text>
                  <Text style={styles.timestamp}>{lastMessage.team[index] === "--" ? '' : formatTime(lastMessage.team[index].timeSent)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          {sessionData?.role === "Superadmin" && (
            <TouchableOpacity style={styles.navItem} onPress={() => router.push({
              pathname: '/(tabs)/msgDashboard/messages/workplaceChat',
              params: { id: companyTeam?.portId || 111, name: sessionData?.companyName || "User" }
            })}>
              <Building color="#fff" size={24} />
              <Text style={styles.navText}>Workplace</Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity onPress={() => router.push("/(tabs)/payslip")}> */}
          <TouchableOpacity onPress={() => router.push("/(tabs)/msgDashboard/messages")}>
            <View style={styles.navItem} >
              <Plus color="#fff" size={24} />
              <Text style={styles.navText}>Messages</Text>
            </View>
          </TouchableOpacity>
          {sessionData?.role === "Superadmin" && (

            filteredItems.branchList?.map((branch: any, index: number) => (
              <TouchableOpacity key={branch.userId} style={styles.chatPreview}
                onPress={() => router.push({
                  pathname: '/(tabs)/msgDashboard/messages/chat',
                  params: { id: branch.id, name: branch.name + " (" + branch.branch + ")", avatar: branch?.profile_pic ? `https://www.portstay.com/imageController/${branch?.profile_pic}.do` : 'https://www.portstay.com/resources/img/Profile/default_company_image.png' }
                })}>
                <Image
                  source={{ uri: branch?.profile_pic ? `https://www.portstay.com/imageController/${branch?.profile_pic}.do` : 'https://www.portstay.com/resources/img/Profile/default_company_image.png' }}
                  style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                  <Text style={styles.chatName}>{branch.name} ({branch.branch})</Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatMessage}>{branch.message[branch.message.length - 1] ? branch.message[branch.message.length - 1].contents : ''}</Text>
                </View>
                <View >
                  <Text style={styles.timestamp}>{branch.message[branch.message.length - 1] ? formatMessageDate(branch.message[branch.message.length - 1].timeSent) : ''}{"  "}</Text>
                  <Text style={styles.timestamp}>{branch.message[branch.message.length - 1] ? formatTime(branch.message[branch.message.length - 1].timeSent) : ''}</Text>
                </View>
              </TouchableOpacity>
            )))}

          {filteredItems.user?.map((user: any, index: number) => (
            <TouchableOpacity key={user.userId} style={styles.chatPreview}
              onPress={() => router.push({
                pathname: '/(tabs)/msgDashboard/messages/chat',
                params: { id: user.id, name: user.name, avatar: user?.profile_pic ? `https://www.portstay.com/imageController/${user?.profile_pic}.do` : 'https://www.portstay.com/resources/img/Profile/default_user_image.png' }
              })}>
              <Image
                source={{ uri: user?.profile_pic ? `https://www.portstay.com/imageController/${user?.profile_pic}.do` : 'https://www.portstay.com/resources/img/Profile/default_user_image.png' }}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{user.name}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatMessage}>{lastMessage.user[index] === "--" ? '' : lastMessage.user[index].contents}</Text>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <Text style={styles.timestamp}>{lastMessage.user[index] === "--" ? '' : formatMessageDate(lastMessage.user[index].timeSent)}{"  "}{formatTime(lastMessage.user[index].timeSent)}</Text>
                {user?.numberOfUnSeenMessage > 0 && <Text style={styles.unseenMessage}>{user?.numberOfUnSeenMessage}</Text>}
              </View>
            </TouchableOpacity>
          ))}



          <TouchableOpacity onPress={() => router.push("/(tabs)/msgDashboard/group")}>
            <View style={styles.navItem}>
              <Plus color="#fff" size={24} />
              <Text style={styles.navText}>Groups</Text>
            </View>
          </TouchableOpacity>

          {filteredItems.group?.map((user: any, index: number) => (
            <TouchableOpacity key={user.id} style={styles.chatPreview}
              onPress={() => router.push({
                pathname: '/(tabs)/msgDashboard/messages/companyChat',
                params: { id: user?.id || 111, name: user.name ? user.name : "User", avatar: user?.profile_pic ? `https://www.portstay.com/imageController/${user?.profile_pic}.do` : 'https://www.portstay.com/resources/img/Profile/default_group_image.png' }
              })}>
              <Image
                source={{ uri: user?.profile_pic ? `https://www.portstay.com/imageController/${user?.profile_pic}.do` : 'https://www.portstay.com/resources/img/Profile/default_group_image.png' }}
                style={styles.avatar}
              />
              <View style={styles.groupchatInfo}>
                <Text style={styles.chatName}>{user.name}</Text>
                {user?.numberOfUnseenPost > 0 && <Text style={styles.unseenMessage}>{user?.numberOfUnseenPost}</Text>}
              </View>
            </TouchableOpacity>
          ))}
          {sessionData?.role !== "Superadmin" && (
            <View style={styles.navItem}>
              <Building color="#fff" size={24} />
              <Text style={styles.navText}>Workplace</Text>
            </View>
          )}
          {filteredItems.company?.map((user: any, index: number) => (
            <TouchableOpacity key={user.userId} style={styles.chatPreview}
              onPress={() => router.push({
                pathname: '/(tabs)/msgDashboard/messages/workplaceChat',
                params: { companyId: user.userId, empId: sessionData?.loginId, name: user.name }
              })}>
              <Image
                source={{ uri: 'https://www.portstay.com/resources/img/Profile/default_company_image.png' }}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{user.name}</Text>
                {/* <Text style={styles.chatMessage}>{lastMessage[index] === "--" ? '' : lastMessage[index].contents}</Text> */}
              </View>
              <View >
                <Text style={styles.timestamp}>{lastMessage.company[index] === "--" ? '' : formatMessageDate(lastMessage.company[index].timeSent)}{"  "}</Text>
                <Text style={styles.timestamp}>{lastMessage.company[index] === "--" ? '' : formatTime(lastMessage.company[index].timeSent)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06607a',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  header: {
    backgroundColor: '#008374',
    padding: 15,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerInfo: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  ellipsisContainer: {
    position: 'relative'
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 10,
    position: 'absolute',
    top: 35,
    right: 0,
    width: 90,
    zIndex: 10,
  },
  timeTrackingContainer: {
    backgroundColor: '#008374',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchContainer: {
    margin: 15,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 5,
  },
  timeValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'monospace',
  },
  totalTimeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008374',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center"
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
    padding: 1,
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#008374',
    padding: 12,
    borderRadius: 5,
    marginBottom: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    objectFit: "cover"
  },
  chatInfo: {
    flex: 1,
    marginLeft: 10,
  },
  groupchatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    flex: 1,
  },

  chatName: {
    textTransform: 'capitalize',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  chatMessage: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    width: 200,
    overflow: 'hidden',

  },
  timestamp: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  unseenMessage: {
    color: '#fff',
    fontSize: 12,
    backgroundColor: '#008374',
    padding: 2,
    borderRadius: 25,
    marginLeft: 5,
    fontWeight: 'bold',
    width: 20,

    height: 20,
    textAlign: 'center',
    alignItems: 'flex-end',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  groupText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#008374',
  },
  successModalContent: {
    padding: 25,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});


