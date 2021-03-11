import React from "react";
import { MediaStream, mediaDevices } from "react-native-webrtc";

interface EnumerateDevicesParams {
  sourceInfos: any;
  setStream: React.Dispatch<any>;
  isFront?: boolean;
}

const getLocalSream = ({
  sourceInfos,
  setStream,
  isFront = true,
}: EnumerateDevicesParams) => {
  let videoSourceId;
  for (let i = 0; i < sourceInfos.length; i++) {
    const sourceInfo = sourceInfos[i];
    if (
      sourceInfo.kind == "videoinput" &&
      sourceInfo.facing == (isFront ? "front" : "environment")
    ) {
      videoSourceId = sourceInfo.deviceId;
    }
  }
  mediaDevices
    .getUserMedia({
      audio: true,
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 480,
          minFrameRate: 30,
        },
        facingMode: isFront ? "user" : "environment",
        optional: [
          {
            sourceId: videoSourceId,
          },
        ],
      },
    })
    .then((stream) => {
      setStream(stream);
    });
};

export default getLocalSream;
