import { RTCView } from "react-native-webrtc";
import styled from "styled-components/native";
import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;

export const Container = styled.View`
  flex: 1;
  background: #000;
`;

export const LocalVideo = styled(RTCView)`
  width: 100px;
  height: 140px;
  background: #222;
  position: absolute;
  bottom: 16px;
  right: 32px;
  elevation: 5;
  z-index: 3;
`;

export const RemoteVideo = styled(RTCView)`
  background: #222;
  flex: 1;
  margin: 16px;
`;
