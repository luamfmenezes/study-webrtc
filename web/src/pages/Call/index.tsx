import React, { useEffect, useRef, useState } from "react";
import { Container, Users, User, Content, Video1, Video2 } from "./styles";
import socketIo from "socket.io-client";
const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

interface ICallUser {
  offer: RTCSessionDescriptionInit;
  socket: string;
}

interface IUpdateList {
  users: string[];
}

interface IAnswerMade {
  user: string;
  answer: RTCSessionDescriptionInit;
}

interface IRecivingCall {
  status?: string;
  user?: string;
  offer?: RTCSessionDescriptionInit;
}

const user = `user:${(Math.random() * 100).toFixed(0)}`;

const socket = socketIo.connect("http://localhost:5555/chat", {
  query: { user },
});

const Call: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [recivingCall, setRecivingCall] = useState<IRecivingCall>({});
  const isAlreadyCalling = useRef(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

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
    socket.on("call-made", async (data: any) => {
      setRecivingCall({ status: true, ...data });
    });

    socket.on("answer-made", async (data: IAnswerMade) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!isAlreadyCalling.current) {
        handleCall(data.user);
        isAlreadyCalling.current = true;
      }
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
    socket.emit("call-user", {
      offer,
      to: user,
    });
  };

  const answerCall = async () => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(recivingCall.offer)
    );

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit("make-answer", {
      answer,
      to: recivingCall.user,
    });
  };

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
        {recivingCall.status && (
          <button onClick={answerCall}>Aceitar ligação</button>
        )}
      </Content>
    </Container>
  );
};

export default Call;
