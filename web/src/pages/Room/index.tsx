import React, { useEffect, useRef, useState } from "react";
import { Container } from "./styles";
import socketIo from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";

const username = `web-user: ${(Math.random() * 100).toFixed(0)}`;

const socket = socketIo("http://10.0.0.108:5555/rooms", {
  query: { username },
});

socket.connect();

interface IPeer {
  id: string;
  stream: MediaStream;
}

const Call: React.FC = () => {
  const [localVideo, setLocalVideo] = useState<MediaStream | undefined>();
  const [peers, setPeers] = useState<IPeer[]>([]);
  const peerCallObj = useRef<any>({});

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
            const call = myPeer.call(peerId, stream);

            call.on("stream", (stream) => addPeer({ id: peerId, stream }));

            // close is not working
            call.on("close", () => {
              console.log("close", peerId);
              setPeers((oldPeers) => oldPeers.filter((el) => el.id !== peerId));
            });

            peerCallObj.current[peerId] = call;
          });
        });

        socket.on("user-disconnected", ({ peerId }: any) => {
          if (peerCallObj.current[peerId]) peerCallObj.current[peerId].close();
        });

        myPeer.on("call", (call) => {
          call.answer(stream);

          const peerIdentity = call.peer;

          peerCallObj.current[peerIdentity] = call;

          call.on("stream", (stream) => addPeer({ id: peerIdentity, stream }));

          call.on("close", () => {
            setPeers((oldPeers) =>
              oldPeers.filter((el) => el.id !== peerIdentity)
            );
          });
        });
      },
      () => {}
    );
  }, []);

  const addPeer = (peer: IPeer) => {
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
      {peers.map((peer) => (
        <video
          key={peer.id}
          ref={(video: any) => {
            if (video) {
              video.srcObject = peer.stream;
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
