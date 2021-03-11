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
        name="Home"
        component={Home}
        options={{ title: "Overview" }}
      />
      <Stack.Screen name="CallRecieving" component={CallRecieving} />
      <Stack.Screen name="Call" component={Call} />
    </Stack.Navigator>
  );
}

export default Routes;
