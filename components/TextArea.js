import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const TextArea = (aState, setTheState, setModified, isDescription) => {
  return (
    <View style={styles.viewStyle}>
      {isDescription ? (
        <TextInput
          style={styles.TextAreaDescription}
          value={aState}
          onChangeText={(text) => {
            setTheState(text);
            setModified(true);
          }}
          multiline={true}
          numberOfLine={3}
        />
      ) : (
        <TextInput
          style={styles.TextArea}
          value={aState}
          onChangeText={(text) => {
            setTheState(text);
            setModified(true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    width: 300,
    margin: 20,
    borderColor: "cyan",
  },

  TextArea: {
    width: "100%",
    height: 40,
    textAlign: "left",
    backgroundColor: "white",
    borderBottomColor: "red",
    borderBottomWidth: 1,
    padding: 5,
  },

  TextAreaDescription: {
    width: 300,
    height: 100,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 1,
    padding: 5,
  },
});

export default TextArea;
