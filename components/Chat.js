import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    const { name, color } = route.params;
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        // Set screen title according to given name from prop
        navigation.setOptions({ title: name });
    }, []);

    return (
        // Set background color according to given prop color from start screen
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text></Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Chat;