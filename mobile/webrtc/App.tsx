import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import Notification from "./src/components/Notification";
import { CallProvider } from "./src/hooks/call";
import Call from "./src/components/Call";

export default function App() {
  return (
    <NavigationContainer>
      <CallProvider>
        <Notification />
        {/* <Routes /> */}
        <Call />
      </CallProvider>
    </NavigationContainer>
  );
}
