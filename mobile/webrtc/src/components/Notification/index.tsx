import React from "react";
import { useEffect } from "react";
import OneSignal, { OpenedEventAction } from "react-native-onesignal";
import { navigate } from "../../helpers/navigator";

interface IAction extends OpenedEventAction {
  actionId?: string;
}

const externalUserId = "luam-fmenezes";

const Notification = () => {
  useEffect(() => {
    console.log("Notification initialized");

    OneSignal.setAppId("66fd6f02-0d9a-46bd-ba2a-2f1ce93060e3");

    OneSignal.setNotificationOpenedHandler((event) => {
      const { action, notification } = event;

      const id = notification.notificationId;
      const data = notification.additionalData;

      const { actionId = "default" }: IAction = action;

      navigate("Call", { roomId: "roomId" });
    });

    OneSignal.setNotificationOpenedHandler(() => {
      // console.log("paralele event");
    });

    OneSignal.setExternalUserId(externalUserId, (results) => {
      // console.log("user-id: ", results);
    });
  }, []);

  return null;
};

export default Notification;
