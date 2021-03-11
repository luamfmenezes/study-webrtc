import React, { useEffect } from "react";
import { Text } from "react-native";
import { mediaDevices } from "react-native-webrtc";
import { useCall } from "../../hooks/call";

// import { Container } from './styles';

const isFront = true;

const Call: React.FC = () => {
  const { setStream } = useCall();

  useEffect(() => {
    mediaDevices.enumerateDevices().then((sourceInfos) => {
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
    });
  }, []);

  return <Text>Call</Text>;
};

export default Call;
