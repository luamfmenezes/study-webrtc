import React, { useEffect, useRef, useState } from "react";
import { Container } from "./styles";
import socketIo from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";

const username = `web-user: ${(Math.random() * 100).toFixed(0)}`;

const socket = socketIo("http://10.0.0.108:5555/rooms", {
  query: { username },
});

socket.connect();

const Call: React.FC = () => {
  const [localVideo, setLocalVideo] = useState<MediaStream | undefined>();
  const [peers, setPeers] = useState<MediaStream[]>([]);
  const userCallObj = useRef<any>({});

  useEffect(() => {
    navigator.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        setLocalVideo(stream);

        const myPeer = new Peer({
          host: "localhost",
          port: 9000,
          path: "/myapp",
        });

        myPeer.on("open", (peerId) => {
          socket.emit("join-room", { peerId });
        });

        socket.on("users-connected", (users: any[]) => {
          users.forEach(({ peerId }) => {
            console.log(peerId);
            const call = myPeer.call(peerId, stream);

            call.on("stream", addPeer);

            // close is not working
            call.on("close", () => {
              console.log("close", peerId);
              setPeers((oldPeers) => oldPeers.filter((el) => el.id !== peerId));
            });

            userCallObj.current[peerId] = call;
          });
        });

        socket.on("user-disconnected", ({ peerId }: any) => {
          if (userCallObj.current[peerId]) userCallObj.current[peerId].close();
        });

        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", addPeer);
        });
      },
      () => {}
    );
  }, []);

  const addPeer = (peer: MediaStream) => {
    setPeers((oldPeers) => {
      const exist = oldPeers.map((el) => el.id).includes(peer.id);
      return exist ? oldPeers : [...oldPeers, peer];
    });
  };

  console.log(peers);

  return (
    <Container>
      {localVideo && (
        <video
          ref={(video: any) => {
            if (video) {
              video.srcObject = localVideo;
            }
          }}
          playsInline
          autoPlay
          muted
          width={320}
          height={280}
        />
      )}
      {peers.map((stream) => (
        <video
          key={stream.id}
          ref={(video: any) => {
            if (video) {
              video.srcObject = stream;
            }
          }}
          playsInline
          autoPlay
          muted
          width={320}
          height={280}
        />
      ))}
    </Container>
  );
};

export default Call;
