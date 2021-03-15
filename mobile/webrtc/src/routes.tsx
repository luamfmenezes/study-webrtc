import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/Home";
import CallRecieving from "./pages/CallRecieving";
import Call from "./pages/Call";

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CallRecieving"
        component={CallRecieving}
        options={{ title: "Reciving call" }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: "Home page" }}
      />
      <Stack.Screen name="Call" component={Call} options={{ title: "Room" }} />
    </Stack.Navigator>
  );
}

export default Routes;
