class Chat {
    UI = {
        userVideo : document.getElementById('user-video'),
        opponentVideo : document.getElementById('opponent-video')
    }

    constructor(socket) {
        this.socket = socket;
        this.peer = new Peer(undefined, {host: location.hostname, port: 9000, path: '/myapp'});
        this.UI.userVideo.muted = true;

        this.peer.on('open', peerId => {
            this.setupCommunication(peerId);
        })
    }

    setupCommunication(peerId) {
        const chat = this;

        navigator.mediaDevices.getUserMedia({
            video: { width: 159, height: 208 },
            audio: true
        }).then(stream => {
            chat.addVideoStream(chat.UI.userVideo, stream)
            chat.peer.on('call', call => {
                call.answer(stream);
                chat.setupCall(call);
            })
            chat.socket.on('peer.connected', peerId => {
                const call = chat.peer.call(peerId, stream);
                chat.setupCall(call);
            })
            chat.socket.emit('peer.connected', peerId);
        }).catch(err => {
            console.error(err.message)
            console.error(err.name)
        })
    }

    setupCall(call) {
        const chat = this;

        call.on('stream', opponentVideoStream => {
            chat.addVideoStream(chat.UI.opponentVideo, opponentVideoStream)
        })
        call.on('close', () => {
            chat.UI.opponentVideo.close();
        })

        this.socket.on('game.disconnected', () => {
                call.close();
                chat.UI.opponentVideo.close();
            }
        )
    }

    addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => video.play())
    }
}