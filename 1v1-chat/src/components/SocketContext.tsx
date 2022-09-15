import React, {
  createContext,
  PropsWithChildren,
  FC,
  useState,
  useEffect,
  useRef,
} from "react";

import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext(null) as any;

const socket = io("http://localhost:5000/");

const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState(false);

  const [stream, setStream] = useState<MediaStream | any>();
  const [name, setName] = useState<any>("");
  const [call, setCall] = useState<any>({});
  const [me, setMe] = useState<any>("");

  const myVideo = useRef() as any;
  const userVideo = useRef() as any;
  const connectionRef = useRef() as any;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    // get the socket id from me action in the backend
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream: stream }); // not set up call , just answer the call

    // peer bahve similar to the socket, define some actions and then pass soem data into them

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      // set other user video, not tour own strea
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id:any) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true) ; 
    connectionRef.current.destroy() ; 

    window.location.reload() ; 
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider> )
};

export { ContextProvider, SocketContext };
