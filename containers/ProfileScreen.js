import React, { useState, useEffect } from "react";
import TextArea from "../components/TextArea";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Touchable,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import FormData from "form-data";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import unknownUser from "../assets/unknownUser.png";

export default function ProfileScreen({ userToken, setUserData, userId }) {
  // Define the states we need.
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [modified, setModified] = useState();
  const [uploading, setUploading] = useState(false);
  const [warning, setWarning] = useState();

  const fetchData = async () => {
    try {
      const serverResponse = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        { headers: { authorization: userToken } }
      );
      const serverData = serverResponse.data;
      setDescription(serverData.description);
      setEmail(serverData.email);
      setPhoto({ picture: serverData.photo[0].url, modified: false });
      setUsername(serverData.username);
    } catch (error) {
      console.log("error", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // This function is called when the user click on the "galery" button.
  const pictureFromPhone = async () => {
    // Ask user for authorization
    const cameraRollPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraRollPerm.granted) {
      // Select picture from the phone's galery
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      // Update the photo state if an image has been picked.
      if (!pickerResult.cancelled) {
        setPhoto({ picture: pickerResult.uri, modified: true });
      }
    }
  };

  // This function is called when the user click on the "photo" button.
  const takePicture = async () => {
    // Ask for permissions.
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const cameraRollPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPerm.status === "granted" &&
      cameraRollPerm.status === "granted"
    ) {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      setPhoto({ picture: pickerResult.uri, modified: true });
    }
  };

  // The submit function will be called when the "submit" button is pressed. It checks which data have been modified and send them to the backend.
  const submit = async () => {
    // If there is no changes, set a warning
    if (!modified) {
      setWarning("You didn't change any information.");
    } else {
      try {
        const serverResponse = await axios.put(
          `https://express-airbnb-api.herokuapp.com/user/update`,
          {
            email: email,
            username: username,
            description: description,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setWarning();
        setModified(false);
      } catch (error) {
        console.log({ error: error.message });
      }
    }
  };

  const submitImage = async () => {
    if (photo.modified) {
      try {
        const form = new FormData();
        form.append("photo", {
          uri: photo.picture,
          name: "userPicture",
          type: `image/${photo.picture.split(".")}`,
        });
        const serverResponse = await axios.put(
          "https://express-airbnb-api.herokuapp.com/user/upload_picture",
          form,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
      } catch (error) {
        console.log({ error: error.message });
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.ProfileScreen}>
      <View style={styles.pictureSection}>
        {photo === null ? (
          <Image style={styles.photo} source={unknownUser} />
        ) : (
          <Image style={styles.photo} source={{ uri: photo.picture }} />
        )}
        <View style={styles.buttonsView}>
          <TouchableOpacity style={styles.button} onPress={pictureFromPhone}>
            <FontAwesome name="picture-o" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <FontAwesome name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.informationsSection}>
        {TextArea(email, setEmail, setModified, false)}
        {TextArea(username, setUsername, setModified, false)}
        {TextArea(description, setDescription, setModified, true)}
        <TouchableOpacity
          style={styles.submit}
          value="Submit informations"
          onPress={() => {
            submit();
            submitImage();
          }}
        >
          <Text style={styles.submitText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logout}
          title="Log Out"
          onPress={() => {
            setUserData(null);
          }}
        >
          <Text style={styles.submitText}>Log out</Text>
        </TouchableOpacity>
        {warning && <Text>{warning}</Text>}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  ProfileScreen: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignItems: "center",
    backgroundColor: "white",
  },

  pictureSection: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
  },

  photo: {
    width: 200,
    height: 200,
    borderRadius: 125,
    borderColor: "crimson",
    borderWidth: 2,
  },

  buttonsView: {
    justifyContent: "center",
  },

  button: {
    margin: 15,
  },

  informationsSection: {
    alignItems: "center",
  },

  submit: {
    width: 250,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "crimson",
    borderWidth: 3,
    marginBottom: 15,
  },

  submitText: {
    fontSize: 24,
    color: "#717171",
  },

  logout: {
    width: 250,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "crimson",
    borderWidth: 3,
    fontSize: 24,
    backgroundColor: "#E7E7E7",
    color: "#8F8F8F",
    marginBottom: 15,
  },
});
