import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FinishCall from "./pages/FinishCall";
import Room from "./pages/Room";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Room} exact />
        <Route path="/finish" component={FinishCall} exact />
      </Switch>
    </Router>
  );
}
