import { Socket } from "socket.io"
import express from 'express'
import { Player } from "./classes/player"
import { Game } from "./classes/game"
const { ExpressPeerServer } = require('peer');

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get("/", (req : any, res : any) => {
    res.render("main.ejs")
})

let waiting : Player | undefined = undefined;

const socketGameMap = new Map<string, Game>()

io.on('connection', (socket: Socket) => {
    socket.on('game.create', (username) => {
        if (waiting == undefined) {
            waiting = new Player(username, socket);
            socket.emit('game.waiting');
            return;
        }
        const player = new Player(username, socket)
        const game = new Game(player, waiting)
        socketGameMap.set(player.socket.id, game);
        socketGameMap.set(waiting.socket.id, game);

        waiting = undefined;
    });

    socket.on('game.send_turn', (data) => {
        let {x, y} = data;
        let game = socketGameMap.get(socket.id) 
        if (game) {
            game.applyTurn({x, y}, socket)
        }
    })

    socket.on('peer.connected', (peerId) => {
        const game = socketGameMap.get(socket.id);
        if (game) { 
            game.setPeerId(socket, peerId);
            socket.to(game.roomId).broadcast.emit('peer.connected', peerId)
        } else if (waiting?.socket.id == socket.id) {
            waiting.peerId = peerId;
        } else {
            console.error('whtf?')
        }
    })

    socket.on('disconnect', () => {
        if (waiting && waiting.socket.id == socket.id) {
            waiting = undefined;
            return;
        }

        let game = socketGameMap.get(socket.id)
        if (game == undefined) {
            return;
        }

        game.disconnect(socket)
        let opponentId = game.next.socket.id
        socketGameMap.delete(socket.id)
        socketGameMap.delete(opponentId)
    })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {})