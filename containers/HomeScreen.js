import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { View, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import axios from "axios";

import RoomCard from "../components/RoomCard";

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const serverResponse = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms"
      );
      setRooms(serverResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchRooms();
  }, []);

  useEffect(() => {
    let mounted = true;
    async () => {
      try {
        const serverResponse = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        if (mounted) {
          setRooms(serverResponse.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log({ error: error.message });
      }
    };
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.homePage}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => String(item._id)}
          renderItem={({ item }) => <RoomCard data={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  homePage: {
    alignItems: "center",
    margin: 20,
  },
});
