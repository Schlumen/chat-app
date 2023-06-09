import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "./components/Start"
import Chat from "./components/Chat"
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';

// import firebase and firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

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

    // Initialize NetInfo
    const connectionStatus = useNetInfo();

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and Storage and get a reference to the service
    const db = getFirestore(app);
    const storage = getStorage(app);

    // Disable and enable firestore database access acording to Network status
    useEffect(() => {
        if (connectionStatus.isConnected === false) {
            Alert.alert("Connection lost!", "Showing offline messages from cache");
            disableNetwork(db);
        } else {
            enableNetwork(db);
        }
    }, [connectionStatus.isConnected])

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
                >{props => <Chat db={db} storage={storage} isConnected={connectionStatus.isConnected} {...props} />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;