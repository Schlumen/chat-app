import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { onSnapshot, collection, orderBy, query, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {
    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    let unsubMessages;

    useEffect(() => {
        // Set screen title according to given name from prop
        navigation.setOptions({ title: name });

        if (isConnected === true) {
            // Unregister current onSnapshot() listener to avoid registering multiple
            // listeners when useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // Create stream with database to read messages
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, docSnap => {
                let msgList = [];
                docSnap.forEach(doc => {
                    msgList.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    });
                });
                cacheMessages(msgList);
                setMessages(msgList);
            });
        } else {
            loadCachedMessages();
        }

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);

    const cacheMessages = async messagesToCache => {
        try {
            await AsyncStorage.setItem("chat", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message)
        }
    }

    const loadCachedMessages = async () => {
        const cachedChat = await AsyncStorage.getItem("chat");
        cachedChat ? setMessages(JSON.parse(cachedChat)) : setMessages([]);
    }

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

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    return (
        // Set background color according to given prop color from start screen
        <View style={[styles.container, { backgroundColor: color }]}>
            {/* Chat */}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
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