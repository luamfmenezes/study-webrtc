import React, { useEffect, useRef, useState } from "react";
import { Container } from "./styles";
import socketIo from "socket.io-client";
import Peer from "peerjs";

const room = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

const socket = socketIo("http://10.0.0.108:5555/rooms", {
  query: { user: (Math.random() * 100).toFixed(0), room },
});

socket.connect();

const myPeer = new Peer({
  host: "localhost",
  port: 9000,
  path: "/myapp",
});

const Call: React.FC = () => {
  const [localVideo, setLocalVideo] = useState<MediaStream | undefined>();
  const [peers, setPeers] = useState<MediaStream[]>([]);

  useEffect(() => {
    navigator.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        setLocalVideo(stream);

        console.log("started stream");

        socket.on("user-connected", (userId: any) => {
          console.log("connected - userId", userId);

          const call = myPeer.call(userId, stream);

          call.on("stream", (stream) => {
            console.log("stream", stream);
            setPeers((oldPeers) => [...oldPeers, stream]);
          });
        });
      },
      (error) => {
        console.warn(error.message);
      }
    );
  }, []);

  useEffect(() => {
    myPeer.on("open", (userId) => {
      socket.emit("join-room", { room, userId });
      console.log("join room");
    });
  }, []);

  useEffect(() => {
    myPeer.on("call", (call) => {
      call.answer(localVideo);
      console.log("answer");
      call.on("stream", (userVideoStream) => {
        setPeers((oldPeers) => [...oldPeers, userVideoStream]);
      });
    });
  }, [localVideo]);

  console.log("peers", peers);

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
          key={Math.random()}
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
