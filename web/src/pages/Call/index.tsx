import React, { useEffect, useRef, useState } from "react";
import { Container, Users, User, Content, Video1, Video2 } from "./styles";
import socketIo from "socket.io-client";
const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();

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

const user = `user:${(Math.random() * 100).toFixed(0)}`;

const socket = socketIo.connect("http://localhost:5555/chat", {
  query: { user },
});

const Call: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const isAlreadyCalling = useRef(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [ringing, setRinging] = useState({
    status: false,
    offer: undefined,
    user: undefined,
  });

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
    socket.on("connected", async () => {
      console.log("connected");
    });

    socket.on("online-users", (data: string[]) => {
      setUsers(data.filter((el) => el !== user));
    });

    // recivieng a call
    socket.on("call-made", async (data: any) => {
      console.log("2.recive offer from:" + data.user);
      setRinging({ status: true, offer: data.offer, user: data.user });
    });

    socket.on("answer-made", async (data: IAnswerMade) => {
      // set foregin video
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      console.log("recive answer from: " + data.user);

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
    console.log("1.send offer to: " + user);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    // set local video
    socket.emit("call-user", {
      offer,
      to: user,
    });
  };

  const anwserCall = async () => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(ringing.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit("make-answer", {
      answer,
      to: ringing.user,
    });
    console.log("3. save offer and send anwser to: " + ringing.user);
    // setRinging({ status: false, offer: undefined, user: undefined });
  };

  const recuseCall = () => {
    setRinging({ status: false, offer: undefined, user: undefined });
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
        <Video1 ref={video1Ref} autoPlay muted />
        <Video2 ref={video2Ref} autoPlay muted />
        {ringing.status && (
          <>
            <button onClick={recuseCall}>recuse</button>
            <button onClick={anwserCall}>{ringing.user} is calling</button>
          </>
        )}
      </Content>
    </Container>
  );
};

export default Call;
