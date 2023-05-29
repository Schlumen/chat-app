import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {

    // Generate unique image name with timestamp and user ID
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }

    // Upload photo to firebase starage and save it to chat
    const uploadAndSendImage = async (imageURI) => {
        const response = await fetch(imageURI);
        const uniqueRefString = generateReference(imageURI);
        const blob = await response.blob();
        const newUploadRef = ref(storage, uniqueRefString);
        // Upload photo to firebase storage and send it in chat
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            console.log("File has been uploaded successfully");
            const imageURL = await getDownloadURL(snapshot.ref);
            onSend({ image: imageURL });
        });
    }

    // Pick image from gallery and upload it to google firestore
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    }

    // Take photo with device camera
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            try {
                let result = await ImagePicker.launchCameraAsync();
                if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
                else Alert.alert("Permissions haven't been granted.");
            } catch (error) {
                Alert.alert("Cannot open camera!", "There was a problem opening the camera");
            }
        }
    }

    // Get Geo Location and send it to the chat
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    // Action Sheet to select things to share
    const actionSheet = useActionSheet();
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            }
        )
    }

    return (
        // Plus Symbol to open Action Sheet
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Let's you choose to send an image or your geolocation." >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 13,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;