import React, { useRef, useEffect, useState } from "react";
import { Text } from "react-native";
import socketIo from "socket.io-client";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
  MediaTrackConstraints,
  RTCSessionDescriptionType,
} from "react-native-webrtc";
import { TouchableOpacity } from "react-native-gesture-handler";
const configuration = { iceServers: [{ url: "stun:stun.l.google.com:19302" }] };
const peerConnection = new RTCPeerConnection(configuration);

// import { Container } from './styles';

const socket = socketIo("http://10.0.0.108:5555/chat", {
  query: { user: "luam-mobile" },
});

const isFront = true;

const Call: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [stream, setSteam] = useState<any>();
  const [remoteStream, setRemoteStream] = useState<any>();
  const [isOnCall, setIsOnCall] = useState(false);
  const [isRecivingCall, setIsRecivingCall] = useState({
    caller: "",
    description: {},
    status: false,
  });
  const otherUser = useRef("");

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
          setSteam(stream);
        })
        .catch((error: any) => {
          // Log error
        });
    });
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("connected", async () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });

    socket.on("online-users", (data: string[]) => {
      setUsers(data.filter((el) => el !== "luam-mobile"));
    });

    socket.on("offer", async (data: any) => {
      setIsRecivingCall({ status: true, ...data });
      otherUser.current = data.caller;
    });

    socket.on("answer", async (data: any) => {
      await peerConnection.setRemoteDescription(data.description);
    });

    socket.on("icecandidate", async (data: any) => {
      const candidate = new RTCIceCandidate(data.candidate);
      peerConnection
        .addIceCandidate(candidate)
        .catch((e: string) => console.log(e));
    });
  }, []);

  useEffect(() => {
    peerConnection.onaddstream = function (event) {
      setRemoteStream(event.stream);
    };
  }, []);

  useEffect(() => {
    peerConnection.onicecandidate = function (event) {
      if (event.candidate && otherUser.current) {
        socket.emit("send-icecandidate", {
          target: otherUser.current,
          candidate: event.candidate,
        });
      }
    };
  }, []);

  useEffect(() => {
    peerConnection.onconnectionstatechange = function (event) {
      console.log(event);
      // if (peerConnection.iceConnectionState === "connected") {
      //   setIsOnCall(true);
      // }
    };
  }, []);

  const handleCall = async (user: string) => {
    const offer = await peerConnection.createOffer();

    const offerDescription = new RTCSessionDescription(offer);

    await peerConnection.setLocalDescription(offerDescription);

    socket.emit("send-offer", {
      description: offerDescription,
      target: user,
    });
  };

  const handleAnswerCall = async () => {
    if (isRecivingCall.status) {
      await peerConnection.setRemoteDescription(
        isRecivingCall.description as RTCSessionDescriptionType
      );

      const answer = await peerConnection.createAnswer();

      const answerDescription = new RTCSessionDescription(answer);

      await peerConnection.setLocalDescription(answerDescription);

      socket.emit("send-answer", {
        description: answerDescription,
        target: isRecivingCall.caller,
      });

      setIsRecivingCall({ status: false, description: {}, caller: "" });
    }
  };

  const handleCloseCall = async () => {
    window.location.reload();
  };

  const handleRecuseCall = async () => {
    setIsRecivingCall({ status: false, description: {}, caller: "" });
  };

  return (
    <>
      {isRecivingCall.status && (
        <TouchableOpacity onPress={handleAnswerCall}>
          <Text>AcceptCall from {isRecivingCall.caller}</Text>
        </TouchableOpacity>
      )}
      {stream && (
        <RTCView
          streamURL={stream.toURL()}
          style={{ flex: 1, width: 648, height: 480 }}
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{ flex: 1, width: 648, height: 480 }}
        />
      )}
    </>
  );
};

export default Call;
