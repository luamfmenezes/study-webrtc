import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Users, User, Content, Video1, Video2 } from "./styles";
import socketIo from "socket.io-client";
const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const user = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

const socket = socketIo.connect("http://localhost:5555/chat", {
  query: { user },
});

const Call: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isRecivingCall, setIsRecivingCall] = useState({
    status: false,
    offer: undefined,
    user: undefined,
  });
  // const isAlreadyCalling = useRef(false);

  useEffect(() => {
    navigator.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        const localVideo = video1Ref.current;
        if (localVideo) {
          localVideo.srcObject = stream;
        }
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      },
      (error) => {
        console.warn(error.message);
      }
    );
  }, []);

  useEffect(() => {
    socket.on("online-users", (data: string[]) => {
      setUsers(data.filter((el) => el !== user));
    });

    // recivieng a call
    socket.on("order", async (data: any) => {
      console.log("2.recive offer from:" + data.user);
      setIsRecivingCall({ status: true, offer: data.offer, user: data.user });
    });

    socket.on("answer", async (data: any) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      console.log(peerConnection);

      // if (!isAlreadyCalling.current) {
      //   handleCall(data.user);
      //   isAlreadyCalling.current = true;
      // }
    });
  }, []);

  useEffect(() => {
    peerConnection.ontrack = function ({ streams: [stream] }) {
      const remoteVideo = video2Ref.current;
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
    };
  }, []);

  const handleCall = async (user: string) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit("send-order", {
      offer,
      to: user,
    });
  };

  const handleAcceptCall = useCallback(async () => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(isRecivingCall.offer)
    );

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    console.log(peerConnection);

    socket.emit("send-answer", {
      answer,
      to: isRecivingCall.user,
    });
  }, [isRecivingCall]);

  // useEffect(() => {
  //   peerConnection.onicecandidate = function (event) {
  //     console.log(event.target);
  //     console.log(peerConnection.signalingState);
  //     // if (peerConnection.canTrickleIceCandidates) {
  //     //   if (isRecivingCall.status) {
  //     //     handleAcceptCall();
  //     //   }
  //     // }
  //   };
  // }, [isRecivingCall]);

  return (
    <Container>
      <h1>user:{user}</h1>
      <Users>
        {users.map((user) => (
          <User key={user} onClick={() => handleCall(user)}>
            {user}
          </User>
        ))}
      </Users>
      <Content>
        <Video1 ref={video1Ref} playsInline autoPlay muted />
        <Video2 ref={video2Ref} playsInline autoPlay muted />
        {isRecivingCall.status && (
          <button onClick={handleAcceptCall}>
            atender {isRecivingCall.user}
          </button>
        )}
      </Content>
    </Container>
  );
};

export default Call;
