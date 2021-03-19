import React from "react";
import { useEffect } from "react";
import OneSignal, { OpenedEventAction } from "react-native-onesignal";
import env from "../../config/env";
import { navigate } from "../../helpers/navigator";

interface IAction extends OpenedEventAction {
  actionId?: string;
}

const externalUserId = "luam-fmenezes";

const Notification = () => {
  useEffect(() => {
    console.log("Notification initialized");

    console.log(env.oneSignalKey);

    OneSignal.setAppId(env.oneSignalKey);

    OneSignal.setNotificationOpenedHandler((event) => {
      const { action, notification } = event;

      const id = notification.notificationId;
      const data = notification.additionalData;
      const { actionId = "default" }: IAction = action;

      navigate("Call", { roomId: "defaultRoom" });
    });

    OneSignal.setNotificationOpenedHandler(() => {
      // paralele event
    });

    // Set id used on backend to direct messages
    OneSignal.setExternalUserId(externalUserId, (results) => {});
  }, []);

  return null;
};

export default Notification;
