import React, { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warning, setWarning] = useState("");

  const submitForm = async () => {
    if (name && email && description && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          const serverResponse = await axios.post(
            "https://express-airbnb-api.herokuapp.com/user/sign_up",
            {
              email: email,
              username: name,
              description: description,
              password: password,
            }
          );
          navigation.navigate("SignIn");
          setWarning("");
          console.log("server", serverResponse.data.error);
        } catch (error) {
          console.log("error", error.message);
        }
      } else {
        setWarning("Passwords do not match");
      }
    } else {
      setWarning("Please fill every field.");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        alignItems: "center",
        backgroundColor: "white",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        padding: 40,
      }}
    >
      <Image
        style={styles.logo}
        source={require("../assets/Airbnb-logo.jpg")}
      />
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        style={styles.textInput}
        placeholder="email"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <TextInput
        style={styles.textInput}
        placeholder="username"
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
      />
      <TextInput
        style={styles.description}
        placeholder="Please give us a quick description"
        value={description}
        multiline={true}
        maxLength={122}
        numberOfLines={3}
        onChangeText={(text) => {
          setDescription(text);
        }}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
        }}
      />
      <View>
        <Text style={styles.warning}>{warning}</Text>
        <TouchableOpacity
          style={styles.submit}
          title="Sign up"
          onPress={submitForm}
        >
          <Text style={styles.submitText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignIn");
        }}
      >
        <Text style={styles.accountExisting}>
          Already have an account ? Sign in!
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 140,
  },

  title: {
    color: "#848484",
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 20,
    marginBottom: 40,
  },

  textInput: {
    width: "90%",
    marginTop: 15,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomColor: "#F5BDC1",
    borderBottomWidth: 2,
  },

  description: {
    width: "90%",
    height: 75,
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    borderColor: "#F5BDC1",
    borderWidth: 2,
  },

  warning: {
    color: "#ED9393",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  submit: {
    margin: 10,
    width: 150,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ED9393",
    borderWidth: 3,
    borderRadius: 50,
  },

  submitText: {
    fontSize: 20,
    color: "#717171",
  },

  accountExisting: {
    color: "#717171",
  },
});
