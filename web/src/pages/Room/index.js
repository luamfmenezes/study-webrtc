import React, { useRef, useEffect, useState } from "react";
import socketIo from "socket.io-client";

const user = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

const socket = socketIo.connect("http://localhost:5555/chat", {
  query: { user },
});

const Room = () => {
  const [users, setUsers] = useState([]);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socket.on("online-users", (data) => {
          setUsers(data.filter((el) => el !== user));
        });

        socket.on("offer", handleRecieveCall);

        socket.on("answer", handleAnswer);

        socket.on("ice-candidate", handleNewICECandidateMsg);
      });
  }, []);

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    otherUser.current = userID;
    userStream.current
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection();

    peer.onicecandidate = handleICECandidateEvent;

    peer.ontrack = handleTrackEvent;

    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer()
      .then((offer) => peerRef.current.setLocalDescription(offer))
      .then(() => {
        socket.emit("send-offer", {
          target: userID,
          description: peerRef.current.localDescription,
        });
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming) {
    console.log("recived");
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.description);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        socket.emit("send-answer", {
          target: incoming.caller,
          description: peerRef.current.localDescription,
        });
      });
  }

  function handleAnswer(data) {
    const desc = new RTCSessionDescription(data.description);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      socket.emit("send-icecandidate", {
        target: otherUser.current,
        candidate: e.candidate,
      });
    }
  }

  function handleNewICECandidateMsg(data) {
    const candidate = new RTCIceCandidate(data.candidate);
    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  return (
    <div>
      <div>
        {users.map((currentUser) => (
          <button onClick={() => callUser(currentUser)} key={currentUser}>
            {currentUser}
          </button>
        ))}
      </div>
      <div>
        <video autoPlay ref={userVideo} muted />
        <video autoPlay ref={partnerVideo} muted />
      </div>
    </div>
  );
};

export default Room;
