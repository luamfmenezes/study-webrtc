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
import Peer from "react-native-peerjs";

const socket = socketIo("http://10.0.0.108:5555/rooms", {
  query: { username: "mobile-user" },
});

const isFront = true;

interface IPeer {
  id: string;
  stream: MediaStream;
}

const Call: React.FC = () => {
  const [localVideo, setLocalVideo] = useState<any>();
  const [peers, setPeers] = useState<IPeer[]>([]);
  const peerCallObj = useRef<any>({});

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
          setLocalVideo(stream);

          const myPeer = new Peer(undefined, {
            host: "10.0.0.108",
            port: 9000,
            secure: false,
            path: "/myapp",
          });

          myPeer.on("open", (peerId: any) => {
            console.log("here2");
            socket.emit("join-room", { peerId });
          });

          socket.on("users-connected", (users: any[]) => {
            console.log("users", users);

            users.forEach(({ peerId }) => {
              const call = myPeer.call(peerId, stream);

              call.on("stream", (stream: any) =>
                addPeer({ id: peerId, stream })
              );

              // close is not working
              call.on("close", () => {
                console.log("close", peerId);
                setPeers((oldPeers) =>
                  oldPeers.filter((el) => el.id !== peerId)
                );
              });

              peerCallObj.current[peerId] = call;
            });
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    });
  }, []);

  const addPeer = (peer: IPeer) => {
    setPeers((oldPeers) => {
      const exist = oldPeers.map((el) => el.id).includes(peer.id);
      return exist ? oldPeers : [...oldPeers, peer];
    });
  };

  return (
    <>
      {localVideo && (
        <RTCView
          streamURL={localVideo.toURL()}
          style={{ flex: 1, width: 320, height: 280 }}
        />
      )}
      {peers.map((peer) => (
        <RTCView
          key={peer.id}
          streamURL={peer.stream.toURL()}
          style={{ flex: 1, width: 320, height: 280 }}
        />
      ))}
    </>
  );
};

export default Call;
