import { NavigationContainerRef } from "@react-navigation/core";
import { createRef } from "react";

export const navigationRef = createRef<NavigationContainerRef>();

export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}
