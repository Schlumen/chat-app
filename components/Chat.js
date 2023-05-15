import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { onSnapshot, collection, orderBy, query, addDoc } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Set screen title according to given name from prop
        navigation.setOptions({ title: name });

        // Create stream with database to read messages
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, docSnap => {
            let msgList = [];
            docSnap.forEach(doc => {
                msgList.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                });
            });
            setMessages(msgList);
        });

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    const renderBubble = props => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: '#004d01' },
                left: { backgroundColor: '#010f78' }
            }}
            textStyle={{
                left: { color: '#fff' }
            }}
        />
    }

    return (
        // Set background color according to given prop color from start screen
        <View style={[styles.container, { backgroundColor: color }]}>
            {/* Chat */}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{ _id: userID, name }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default Chat;