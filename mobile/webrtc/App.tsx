import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Call from "./src/components/Call";

export default function App() {
  return (
    <View style={styles.container}>
      <Call />
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
