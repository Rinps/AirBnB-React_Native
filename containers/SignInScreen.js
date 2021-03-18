import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
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
import axios from "axios";

export default function SignInScreen({ setUserData }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  return (
    <View style={styles.SignInScreen}>
      <Image
        style={styles.logo}
        source={require("../assets/Airbnb-logo.jpg")}
      />
      <Text style={styles.title}>Sign in</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          placeholder="email"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Text style={styles.warning}>{warning}</Text>
        <TouchableOpacity
          style={styles.submit}
          title="Sign in"
          onPress={async () => {
            if (email && password) {
              try {
                const serverResponse = await axios.post(
                  "https://express-airbnb-api.herokuapp.com/user/log_in",
                  { email, password }
                );
                const userToken = serverResponse.data.token;
                const userId = serverResponse.data.id;
                setUserData(userToken, userId);
                setWarning("");
              } catch (error) {
                setWarning(
                  "Couldn't connect to this account. Please verify the email and password."
                );
                console.log("error:", error.message);
              }
            } else {
              setWarning("Please fill all fields");
            }
          }}
        >
          <Text style={styles.submitText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.noAccount}>No account ? Register!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  SignInScreen: {
    alignItems: "center",
    backgroundColor: "white",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    padding: 40,
  },

  logo: {
    width: 120,
    height: 140,
  },

  title: {
    color: "#848484",
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 20,
    marginBottom: 60,
  },

  form: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  textInput: {
    width: "90%",
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomColor: "#F5BDC1",
    borderBottomWidth: 2,
  },

  warning: {
    color: "#ED9393",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 10,
  },

  submit: {
    margin: 20,
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

  noAccount: {
    color: "#717171",
  },
});
