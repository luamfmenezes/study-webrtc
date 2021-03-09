import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Call from "./src/components/Call";
import Notification from "./src/components/Notification";

export default function App() {
  return (
    <View style={styles.container}>
      <Call />
      <Notification />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
