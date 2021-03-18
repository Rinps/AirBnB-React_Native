import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RatingStars = (props) => {
  const { ratingValue } = props;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= ratingValue) {
      stars.push(
        <Ionicons
          style={styles.star}
          name="ios-star-sharp"
          size={24}
          color="gold"
          key={i}
        />
      );
    } else {
      stars.push(
        <Ionicons
          style={styles.star}
          name="ios-star-sharp"
          size={24}
          color="grey"
          key={i}
        />
      );
    }
  }

  return <View style={styles.stars}>{stars}</View>;
};

const styles = StyleSheet.create({
  stars: {
    flexDirection: "row",
    height: 30,
    width: 120,
  },
});

export default RatingStars;
