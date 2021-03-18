import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";

import RatingStars from "./RatingStars";

const RoomCard = (props) => {
  // Extract data from props.
  const { _id, price, photos, title, ratingValue, user } = props.data;
  const userPhoto = user.account.photo.url;
  const navigation = useNavigation();

  // We only need one photo for the component render, we take the first one.
  const mainPicture = photos[0];

  return (
    <TouchableOpacity
      style={styles.room}
      onPress={() => navigation.navigate("RoomPage", { id: _id })}
    >
      <View style={styles.roomHeader}>
        <Image style={styles.roomPicture} source={{ uri: mainPicture.url }} />
        <Text style={styles.roomPrice}>{price} €</Text>
      </View>
      <View style={styles.roomDetails}>
        <View>
          <Text>{title}</Text>
          <RatingStars ratingValue={ratingValue} />
        </View>
        <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  room: {
    marginTop: 15,
    marginBottom: 15,
  },

  roomHeader: {
    alignItems: "center",
    width: "100%",
  },

  roomPicture: {
    width: "100%",
    height: 200,
    position: "relative",
  },

  roomPrice: {
    position: "absolute",
    color: "white",
    backgroundColor: "black",
    bottom: 0,
    left: 0,
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },

  roomDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
  },

  userPhoto: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
});

export default RoomCard;
