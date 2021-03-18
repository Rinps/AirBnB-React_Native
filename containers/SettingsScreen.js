import React from "react";
import { Button, Text, View } from "react-native";

export default function SettingsScreen({ setToken, userId }) {
  return (
    <View>
      <Text>Hello {userId}</Text>

      <Button
        title="Log Out"
        onPress={() => {
          setToken(null);
        }}
      />
    </View>
  );
}
