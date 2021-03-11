import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import socketIo from "socket.io-client";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCSessionDescriptionType,
} from "react-native-webrtc";

const configuration = { iceServers: [{ url: "stun:stun.l.google.com:19302" }] };

const peerConnection = new RTCPeerConnection(configuration);

const socket = socketIo("http://10.0.0.108:5555/chat", {
  query: { user: "luam-mobile" },
});

interface IisRecivingCall {
  caller: string;
  description: any;
  status: boolean;
}

interface ICallContext {
  stream: MediaStream | boolean;
  remoteStream: MediaStream | boolean;
  isOnCall: boolean;
  isRecivingCall: IisRecivingCall;
  handleCall: (user: string) => void;
  handleAnswerCall: () => void;
  handleCloseCall: () => void;
  handleRecuseCall: () => void;
  setStream: React.Dispatch<any>;
}

const CallContext = createContext<ICallContext>({} as ICallContext);

const CallProvider: React.FC = ({ children }) => {
  const [stream, setStream] = useState<any>();
  const [remoteStream, setRemoteStream] = useState<any>();
  const [isOnCall, setIsOnCall] = useState(false);
  const [isRecivingCall, setIsRecivingCall] = useState({
    caller: "",
    description: {},
    status: false,
  });
  const otherUser = useRef("");

  useEffect(() => {
    socket.connect();

    socket.on("connected", async () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
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
      peerConnection
        .addIceCandidate(candidate)
        .catch((e: string) => console.log(e));
    });
  }, []);

  useEffect(() => {
    peerConnection.onaddstream = function (event) {
      setRemoteStream(event.stream);
    };
  }, []);

  useEffect(() => {
    peerConnection.onicecandidate = function (event) {
      console.log("seng Ice candidate");
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
      console.log(event);
      // if (peerConnection.iceConnectionState === "connected") {
      //   setIsOnCall(true);
      // }
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
    if (isRecivingCall.status) {
      await peerConnection.setRemoteDescription(
        isRecivingCall.description as RTCSessionDescriptionType
      );

      const answer = await peerConnection.createAnswer();

      const answerDescription = new RTCSessionDescription(answer);

      await peerConnection.setLocalDescription(answerDescription);

      socket.emit("send-answer", {
        description: answerDescription,
        target: isRecivingCall.caller,
      });

      setIsRecivingCall({ status: false, description: {}, caller: "" });
    }
  };

  const handleCloseCall = async () => {};

  const handleRecuseCall = async () => {
    setIsRecivingCall({ status: false, description: {}, caller: "" });
  };

  return (
    <CallContext.Provider
      value={{
        stream,
        remoteStream,
        isOnCall,
        isRecivingCall,
        handleCall,
        handleAnswerCall,
        handleCloseCall,
        handleRecuseCall,
        setStream,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

const useCall = (): ICallContext => {
  const context = useContext(CallContext);

  if (!context) {
    throw new Error(
      "You should execute this hook only inside of one react component"
    );
  }

  return context;
};

export { useCall, CallProvider };
