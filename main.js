let APP_ID = "95b422bb63754dfc90c4d9aa08ed6c4d";

let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room");

if (!roomId) {
  window.location = "lobby.html";
}

let localStream;
let remoteStream;
let peerConeection;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let constrain = {
  video: {
    width: {min: 640, ideal: 1920, max: 1920} ,
    height:{min:480, ideal:1080, max:1080},
  }, 
  audio: true 
}

let init = async () => {
  client = await AgoraRTM.createInstance(APP_ID);
  await client.login({ uid, token });

  // index.html?room=1234
  channel = client.createChannel(roomId);

  // join channel
  await channel.join();
  channel.on("MemberJoined", handleUserJoined);
  channel.on("MemberLeft", handleUserLeft);

  client.on("MessageFromPeer", handleMessageFromPeer);

  // request media permission
  localStream = await navigator.mediaDevices.getUserMedia(constrain);

  document.getElementById("user-1").srcObject = localStream;
};

let handleUserLeft = (MemberId) => {
  document.getElementById("user-2").style.display = "none";
  document.getElementById("user-1").classList.remove('smallFrame');
};

let handleUserJoined = async (MemberId) => {
  console.log("A new user has join", MemberId);
  createOffer(MemberId);
};
let handleMessageFromPeer = async (message, MemberId) => {
  message = JSON.parse(message.text);
  console.log("Message: ", message);

  if (message.type === "offer") {
    createAnswer(MemberId, message.offer);
  }

  if (message.type === "answer") {
    addAnswer(message.answer);
  }

  if (message.type === "candidate") {
    if (peerConeection) {
      peerConeection.addIceCandidate(message.candidate);
    }
  }
};

let createPeerConnection = async (MemberId) => {
  peerConeection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;
  document.getElementById("user-2").style.display = "block";
  document.getElementById("user-1").classList.add('smallFrame');

  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    document.getElementById("user-1").srcObject = localStream;
  }

  localStream.getTracks().forEach((track) => {
    peerConeection.addTrack(track, localStream);
  });
  // listen after adding track
  peerConeection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // generate iec candidates
  peerConeection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log("new ICE candidate:  ", event.candidate);
      client.sendMessageToPeer(
        {
          text: JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
          }),
        },
        MemberId
      );
    }
  };
};

let createOffer = async (MemberId) => {
  await createPeerConnection(MemberId);
  // Create offer
  let offer = await peerConeection.createOffer();
  await peerConeection.setLocalDescription(offer);

  // setlocalDescription will fire onicecandidat

  console.log("offer: ", offer);

  // send offrt
  client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: offer }) },
    MemberId
  );
};

let createAnswer = async (MemberId, offer) => {
  await createPeerConnection(MemberId);

  await peerConeection.setRemoteDescription(offer);

  let answer = await peerConeection.createAnswer();

  // local decs for 2nd peer
  await peerConeection.setLocalDescription(answer);

  // send back sdp answer
  client.sendMessageToPeer(
    { text: JSON.stringify({ type: "answer", answer: answer }) },
    MemberId
  );
};

let addAnswer = async (answer) => {
  if (!peerConeection.currentRemoteDescription) {
    peerConeection.setRemoteDescription(answer);
  }
  // peer 1 send offer
};

let leaveChannel = async () => {
  await channel.leave();
  await client.logout();
};

let toggleCamera = async () => {
  let videoTrack = localStream.getTracks().find(track => track.kind === 'video');

  if (videoTrack.enabled) {
    videoTrack.enabled = false ;
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(255,80,80)';
  } else {
    videoTrack.enabled = true ; 
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249,.9)';
  }
}

let toggleMic = async () => {
  let audioTrack = localStream.getTracks().find(track => track.kind === 'audio');

  if (audioTrack.enabled) {
    audioTrack.enabled = false ;
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(255,80,80)';
  } else {
    audioTrack.enabled = true ; 
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249,.9)';
  }
}
window.addEventListener("beforeunload", leaveChannel);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
init();
