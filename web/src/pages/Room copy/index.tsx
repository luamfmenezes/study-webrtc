import React, { useEffect, useMemo, useRef, useState } from "react";
import socketIo from "socket.io-client";
import Peer from "peerjs";
import {
  Container,
  Calling,
  Content,
  Footer,
  Controllers,
  LocalVideo,
  RemoteVideos,
} from "./styles";
import { MdCallEnd } from "react-icons/md";
import Loading from "../../components/Loading";
import { useHistory } from "react-router";

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
  const myPeerRef = useRef<Peer>();
  const { push } = useHistory();

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

        myPeerRef.current = myPeer;

        myPeer.on("open", (peerId) => {
          socket.emit("join-room", { peerId });
        });

        socket.on("users-connected", (users: any[]) => {
          console.log(users);

          users.forEach(({ peerId }) => {
            const call = myPeer.call(peerId, stream);

            console.log(peerId);

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

  const isCalling = useMemo(() => peers.length === 0, [peers]);

  useEffect(() => {
    socket.on("close-room", () => {
      myPeerRef.current?.destroy();
      push("/finish");
    });
  });

  const handleCloseRoom = () => {
    socket.emit("close-room");
  };

  return (
    <Container>
      {isCalling ? (
        <Calling>
          <h1>Calling...</h1>
          <Loading />
        </Calling>
      ) : (
        <Content>
          {peers.map((peer) => (
            <RemoteVideos
              key={peer.id}
              ref={(video: any) => {
                if (video) {
                  video.srcObject = peer.stream;
                }
              }}
              playsInline
              autoPlay
              muted
            />
          ))}
        </Content>
      )}

      <Footer>
        <div />
        <Controllers>
          {!isCalling && (
            <button>
              <MdCallEnd color="#FFF" size={24} onClick={handleCloseRoom} />
            </button>
          )}
        </Controllers>
        <div>
          {localVideo && (
            <LocalVideo
              ref={(video: any) => {
                if (video) {
                  video.srcObject = localVideo;
                }
              }}
              playsInline
              autoPlay
              muted
              width={240}
              height={180}
            />
          )}
        </div>
      </Footer>
    </Container>
  );
};

export default Call;
