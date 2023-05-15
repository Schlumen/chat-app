import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "./components/Start"
import Chat from "./components/Chat"

// import firebase and firestore
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const Stack = createNativeStackNavigator();

const App = () => {

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDOOuLp2wfoxAho-pc0N9dqIQCU1WkQJoU",
        authDomain: "chat-app-xx.firebaseapp.com",
        projectId: "chat-app-xx",
        storageBucket: "chat-app-xx.appspot.com",
        messagingSenderId: "627008813908",
        appId: "1:627008813908:web:557789001c5d34c83e66c1"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    return (
        // Use navigation container to navigate between diferent screens
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Start'>
                <Stack.Screen
                    name='Start'
                    component={Start}
                />
                <Stack.Screen
                    name='Chat'
                >{props => <Chat db={db} {...props} />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;