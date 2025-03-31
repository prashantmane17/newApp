import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Sample contact data
const contacts = [
    {
        id: '1',
        name: 'Snehal',
        avatar: 'https://plus.unsplash.com/premium_photo-1682089810582-f7b200217b67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D',
        lastMessage: 'Where are you?',
        time: '5m ago'
    },
    {
        id: '2',
        name: 'Pooja',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        lastMessage: 'Kuthe ahes',
        time: '30m ago'
    },
    {
        id: '3',
        name: 'Ganesh',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
        lastMessage: 'Hii',
        time: '2h ago'
    }
];

export default function MessagesScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            {contacts.map(contact => (
                <TouchableOpacity
                    key={contact.id}
                    style={styles.contactItem}
                    onPress={() => router.push({
                        pathname: '/messages/chat',
                        params: { name: contact.name, avatar: contact.avatar }
                    })}
                >
                    <Image
                        source={{ uri: contact.avatar }}
                        style={styles.avatar}
                    />
                    <View style={styles.contactInfo}>
                        <Text style={styles.name}>{contact.name}</Text>
                        <Text style={styles.lastMessage}>{contact.lastMessage}</Text>
                    </View>
                    <Text style={styles.time}>{contact.time}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contactItem: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    contactInfo: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
});