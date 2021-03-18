import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MapView from "react-native-maps";
import axios from "axios";

import RatingStars from "../components/RatingStars";
import { withSafeAreaInsets } from "react-native-safe-area-context";

const RoomScreen = ({ route }) => {
  const id = route.params.id;

  const [room, setRoom] = useState();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoom = async () => {
    try {
      const serverResponse = await axios.get(
        `https://express-airbnb-api.herokuapp.com/rooms/${id}`
      );
      const user = serverResponse.data.user;
      setRoom(serverResponse.data);
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView style={styles.RoomPage}>
          <View style={styles.RoomsScreen}>
            <ImageBackground
              source={{ uri: room.photos[0].url }}
              style={styles.pictureAndPrice}
            >
              <View style={styles.priceView}>
                <Text style={styles.price}>{room.price} €</Text>
              </View>
            </ImageBackground>
            <View>
              <View style={styles.roomDatas}>
                <View style={styles.titleAndRate}>
                  <Text style={styles.title} numberOfLines={1}>
                    {room.title}
                  </Text>
                  <View style={styles.rates}>
                    <RatingStars ratingValue={room.ratingValue} />
                    <Text style={styles.nRates}>{room.reviews} reviews</Text>
                  </View>
                </View>
                <Image
                  style={styles.userPicture}
                  source={{ uri: user.account.photo.url }}
                />
              </View>
              <View style={styles.descriptionView}>
                <Text style={styles.description} numberOfLines={3}>
                  {room.description}
                </Text>
              </View>
            </View>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: room.location[1],
                longitude: room.location[0],
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showUserLocation={true}
            >
              <MapView.Marker
                key={1}
                coordinate={{
                  latitude: room.location[1],
                  longitude: room.location[0],
                }}
                title={room.title}
                description={room.description}
              />
            </MapView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  RoomPage: {
    width: 300,
    marginTop: 20,
    marginBottom: 20,
    flexShrink: 1,
  },

  pictureAndPrice: {
    resizeMode: "cover",
    width: "100%",
    height: 100,
    position: "relative",
  },

  priceView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 60,
    height: 30,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  price: {
    color: "white",
    fontWeight: "bold",
  },

  roomDatas: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
  },

  titleAndRate: {
    height: 75,
    flex: 1,
  },

  title: {
    fontSize: 18,
  },

  rates: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexShrink: 1,
  },

  nRates: {
    color: "grey",
    fontSize: 12,
  },

  userPicture: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },

  descriptionView: {
    marginTop: 5,
    marginBottom: 5,
  },

  description: {
    fontSize: 10,
    textAlign: "justify",
  },

  map: {
    width: "100%",
    height: 300,
    marginTop: 10,
  },
});

export default RoomScreen;
