import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Users,
  User,
  Content,
  Video1,
  Video2,
  Controllers,
  ModalCalling,
} from "./styles";
import socketIo from "socket.io-client";
import { MdCall, MdCallEnd, MdContacts } from "react-icons/md";
const { RTCPeerConnection, RTCSessionDescription } = window;
let peerConnection = new RTCPeerConnection();

const user = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

const socket = socketIo("http://10.0.0.108:5555/chat", {
  query: { user },
});

const Call: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [isOnCall, setIsOnCall] = useState(false);
  const [isRecivingCall, setIsRecivingCall] = useState({
    caller: "",
    description: {},
    status: false,
  });
  const otherUser = useRef("");
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
    socket.connect();

    socket.on("connected", async () => {
      console.log("connected");
    });

    socket.on("online-users", (data: string[]) => {
      setUsers(data.filter((el) => el !== user));
    });

    socket.on("offer", async (data: any) => {
      setIsRecivingCall({ status: true, ...data });
      otherUser.current = data.caller;
    });

    socket.on("answer", async (data: any) => {
      await peerConnection.setRemoteDescription(data.description);
    });

    socket.on("icecandidate", async (data: any) => {
      const candidate = new RTCIceCandidate(data.candidate);
      peerConnection.addIceCandidate(candidate).catch((e) => console.log(e));
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

  useEffect(() => {
    peerConnection.onicecandidate = function (event) {
      if (event.candidate && otherUser.current) {
        socket.emit("send-icecandidate", {
          target: otherUser.current,
          candidate: event.candidate,
        });
      }
    };
  }, []);

  useEffect(() => {
    peerConnection.onconnectionstatechange = function (event) {
      if (peerConnection.iceConnectionState === "connected") {
        setIsOnCall(true);
      }
    };
  }, []);

  const handleCall = async (user: string) => {
    const offer = await peerConnection.createOffer();

    const offerDescription = new RTCSessionDescription(offer);

    await peerConnection.setLocalDescription(offerDescription);

    socket.emit("send-offer", {
      description: offerDescription,
      target: user,
    });
  };

  const handleAnswerCall = async () => {
    await peerConnection.setRemoteDescription(isRecivingCall.description);

    const answer = await peerConnection.createAnswer();

    const answerDescription = new RTCSessionDescription(answer);

    await peerConnection.setLocalDescription(answerDescription);

    socket.emit("send-answer", {
      description: answerDescription,
      target: isRecivingCall.caller,
    });

    setIsRecivingCall({ status: false, description: {}, caller: "" });
  };

  const handleCloseCall = async () => {
    window.location.reload();
  };

  const handleRecuseCall = async () => {
    setIsRecivingCall({ status: false, description: {}, caller: "" });
  };

  return (
    <Container>
      <Users isOnCall={isOnCall}>
        <h1>
          <MdContacts size={24} color="#ded9ef" />
          Online users
        </h1>
        {users.map((currentUser) => (
          <User key={currentUser} onClick={() => handleCall(currentUser)}>
            <div>
              <img
                src={`https://ui-avatars.com/api/?name=${currentUser}&background=0D8ABC&color=fff`}
                alt={currentUser}
              />
              <p>{currentUser}</p>
            </div>
            <MdCall color="#ded9ef" size={24} />
          </User>
        ))}
      </Users>
      <Content>
        <Video1 ref={video1Ref} playsInline autoPlay muted />
        <Video2 ref={video2Ref} playsInline autoPlay muted />
        {isRecivingCall.status && (
          <ModalCalling>
            <h1>{isRecivingCall.caller} is calling</h1>
            <div>
              <button>
                <MdCallEnd color="#001" size={24} onClick={handleRecuseCall} />
              </button>
              <button>
                <MdCall color="#001" size={24} onClick={handleAnswerCall} />
              </button>
            </div>
          </ModalCalling>
        )}
        {isOnCall && (
          <Controllers>
            <button>
              <MdCallEnd color="#001" size={24} onClick={handleCloseCall} />
            </button>
          </Controllers>
        )}
      </Content>
    </Container>
  );
};

export default Call;
