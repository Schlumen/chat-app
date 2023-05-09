import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    const { name, color } = route.params;
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        // Set screen title according to given name from prop
        navigation.setOptions({ title: name });

        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any"
                }
            },
            {
                _id: 2,
                text: 'This is a System message',
                createdAt: new Date(),
                system: true
            }
        ]);
    }, []);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }

    const renderBubble = props => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: '#000' },
                left: { backgroundColor: '#FFF' }
            }}
        />
    }

    return (
        // Set background color according to given prop color from start screen
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
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