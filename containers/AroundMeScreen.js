import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import RoomCard from "../components/RoomCard";

const AroundMeScreen = () => {
  const [rooms, setRooms] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [noRooms, setNoRooms] = useState(false);
  const [userXY, setUserXY] = useState(null);
  const [markers, setMarkers] = useState();
  const [activeRoom, setActiveRoom] = useState();

  const askPermission = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      setError();
      const location = await Location.getCurrentPositionAsync();
      const objXY = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserXY(objXY);
    } else {
      setError(
        "We understand that you don't wish to share your location. However, we need your coordinates to use this service. Please allow the application to use your phone geolocation."
      );
      Alert.alert("Permission warning", error, [
        {
          text: "I will think about it",
          onPress: () => console.log("The user will think about it... I think"),
        },
      ]);
    }
  };

  const fetchData = async () => {
    // The fetchData function must only be run if no rooms are loaded
    if (!rooms) {
      try {
        const serverResponse = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        setRooms(serverResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.log({ error: error.message });
      }
    }
  };

  const markersGeneration = () => {
    // Create a list containing every marker that will be displayed on the map.
    if (rooms && userXY) {
      const newArray = [];
      for (let i = 0; i < rooms.length; i++) {
        // We want to handle simultaneously two cases: When a room's coordinates is greater than the user's and when its inferior. To do this, we use the (a - b)2 remarkable identity, in order to check if the room is close enough to the user.
        const comparisonLatitude =
          Math.pow(userXY.latitude, 2) -
          2 * userXY.latitude * rooms[i].location[1] +
          Math.pow(rooms[i].location[1], 2);
        const comparisonLongitude =
          Math.pow(userXY.longitude, 2) -
          2 * userXY.longitude * rooms[i].location[0] +
          Math.pow(rooms[i].location[0], 2);

        // Now that we have the comparison value, check if it's close enough.
        if (comparisonLatitude < 0.005 && comparisonLongitude < 0.005) {
          const newObj = {
            id: rooms[i]._id,
            longitude: rooms[i].location[0],
            latitude: rooms[i].location[1],
            title: rooms[i].title,
            description: rooms[i].description,
          };
          newArray.push(newObj);
        } else {
          setNoRooms(true);
        }
      }
      setError("");
      setMarkers(newArray);
    }
    if (markers && markers.length === 0) {
      setError("No rooms have been identified near your position, sorry!");
    }
  };

  useEffect(() => {
    if (!userXY) {
      askPermission();
    }
    fetchData();
    markersGeneration();
  }, [userXY, rooms]);

  // The getRoom function is called when a marker is pressed. It extract the marker's datas in order to display them under the MapView.

  const getRoom = (marker) => {
    const { coordinate } = marker.nativeEvent;

    // We need to find the room corresponding to this marker. We will use the coordinates in order to do so.
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (
        room.location[0] === coordinate.longitude &&
        room.location[1] === coordinate.latitude
      ) {
        const newObj = {
          _id: room._id,
          title: room.title,
          description: room.description,
          price: room.price,
          user: room.user,
          ratingValue: room.ratingValue,
          photos: room.photos,
        };
        setActiveRoom(newObj);
        i = rooms.length + 1;
      }
    }
  };

  return (
    <View style={styles.AroundMeScreen}>
      {isLoading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : noRooms ? (
        <Text style={styles.message}>There is no room around you :(</Text>
      ) : (
        <View>
          <Text style={styles.message}>Here are the closest rooms to rent</Text>
          {markers && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userXY.latitude,
                longitude: userXY.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showUserLocation={true}
            >
              {markers.map((marker) => {
                return (
                  <MapView.Marker
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      title: marker.title,
                      description: marker.description,
                    }}
                    onPress={getRoom}
                  />
                );
              })}
            </MapView>
          )}
          {activeRoom && <RoomCard data={activeRoom} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  AroundMeScreen: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    padding: 10,
  },

  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
  },

  map: {
    width: 380,
    height: 380,
  },
});

export default AroundMeScreen;
