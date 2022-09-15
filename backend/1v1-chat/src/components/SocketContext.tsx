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

// const socket = io('http://localhost:5000');
const socket = io("https://warm-wildwood-81069.herokuapp.com");

const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState<any>(false);
  const [callEnded, setCallEnded] = useState<any>(false);
  const [stream, setStream] = useState<any>({});
  const [name, setName] = useState<any>("");
  const [call, setCall] = useState<any>({});
  const [me, setMe] = useState<any>("");

  const myVideo = useRef<any>();
  const userVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log("current stream", currentStream)
        setStream(currentStream);
        console.log(stream + ' after set')
        myVideo.current.srcObject = currentStream ;

      });

    socket.on("me", (id) => {
      setMe(id);
      
     
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: any) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
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
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
