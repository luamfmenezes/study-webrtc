import React, { useEffect, useRef, useState } from "react";
import { Container } from "./styles";
import socketIo from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";

const room = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

const user = (Math.random() * 100).toFixed(0);

const socket = socketIo("http://10.0.0.108:5555/rooms", {
  query: { user, room },
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

        socket.on("user-connected", (userId: any) => {
          const call = myPeer.call(userId, stream);

          console.log("declare-on-stream", call);

          call.on("stream", (stream) => {
            console.log("stream", stream);
            setPeers((oldPeers) => [...oldPeers, stream]);
          });

          call.on("close", () => {
            setPeers((oldPeers) => oldPeers.filter((el) => el !== userId));
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
    });
  }, []);

  useEffect(() => {
    myPeer.on("call", (call) => {
      navigator.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          call.answer(stream);
        },
        () => undefined
      );
      call.on("stream", (userVideoStream) => {
        setPeers((oldPeers) => [...oldPeers, userVideoStream]);
      });
    });
  }, []);

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
