let APP_ID = "28f1b076e5874d8fbc187b1c9ef09e58"

let token = null ; 

let localStream ;
let remoteStream ;
let peerConeection ;

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

let init = async () => {
    // request media permission
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false 
    })

    document.getElementById('user-1').srcObject = localStream ;
    createOffer() ; 
}

let createOffer = async () => {
    peerConeection = new RTCPeerConnection(servers)  ; 

    remoteStream = new MediaStream() ; 
    document.getElementById('user-2').srcObject = remoteStream ;

    localStream.getTracks().forEach((track)=> {
        peerConeection.addTrack(track, localStream);
    })
    // listen after adding track
    peerConeection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track)=> {
            remoteStream.addTracks(track) ; 
        })
    }

    // generate iec candidates
    peerConeection.onicecandidate = async (event) => {
        if (event.candidate) {
            console.log("new ICE candidate:  ", event.candidate)
        }
    }

    // Create offer 
    let offer = await peerConeection.createOffer() ; 
    await peerConeection.setLocalDescription(offer) ;

    // setlocalDescription will fire onicecandidat

    console.log('offer: ' , offer );
}

init() ; 