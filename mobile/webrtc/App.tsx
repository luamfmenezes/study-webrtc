import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import Notification from "./src/components/Notification";
import Call from "./src/components/Call-pure-webrtc";
import { navigationRef } from "./src/helpers/navigator";

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Notification />
      <Routes />
    </NavigationContainer>
  );
}
