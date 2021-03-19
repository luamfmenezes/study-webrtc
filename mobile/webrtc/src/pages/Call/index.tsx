import React, { useRef, useEffect, useState } from "react";
import Peer from "react-native-peerjs";
import socketIo from "socket.io-client";
import { Container, LocalVideo, RemoteVideo } from "./styles";
import { MediaStream, mediaDevices } from "react-native-webrtc";
import { navigate } from "../../helpers/navigator";
import { useNavigation } from "@react-navigation/core";

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
  const myPeerRef = useRef<Peer>();

  const { navigate } = useNavigation();

  useEffect(() => {
    socket.connect();
    socket.removeAllListeners();
    return () => {
      socket.disconnect();
    };
  }, []);

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

          myPeerRef.current = myPeer;

          myPeer.on("open", (peerId: any) => {
            socket.emit("join-room", { peerId });
          });

          socket.on("users-connected", (users: any[]) => {
            users.forEach(({ peerId }) => {
              const call = myPeer.call(peerId, stream);

              call.on("stream", (stream: any) =>
                addPeer({ id: peerId, stream })
              );

              call.on("close", () => {
                setPeers((oldPeers) =>
                  oldPeers.filter((el) => el.id !== peerId)
                );
              });

              peerCallObj.current[peerId] = call;
            });

            socket.on("user-disconnected", ({ peerId }: any) => {
              if (peerCallObj.current[peerId])
                peerCallObj.current[peerId].close();
            });
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    });
  }, []);

  useEffect(() => {
    socket.on("close-room", () => {
      myPeerRef.current?.destroy();
      navigate("Home");
    });
  });

  useEffect(() => {
    return () => {
      console.log("destroy");
      myPeerRef.current?.destroy();
    };
  }, []);

  const handleCloseRoom = () => {
    socket.emit("close-room");
  };

  const addPeer = (peer: IPeer) => {
    setPeers((oldPeers) => {
      const exist = oldPeers.map((el) => el.id).includes(peer.id);
      return exist ? oldPeers : [...oldPeers, peer];
    });
  };

  return (
    <Container>
      {localVideo && <LocalVideo streamURL={localVideo.toURL()} />}
      {peers.map((peer) => (
        <RemoteVideo key={peer.id} streamURL={peer.stream.toURL()} />
      ))}
    </Container>
  );
};

export default Call;
