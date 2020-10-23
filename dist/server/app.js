"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const player_1 = require("./classes/player");
const game_1 = require("./classes/game");
const { ExpressPeerServer } = require('peer');
const app = express_1.default();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
app.get("/", (req, res) => {
    res.render("main.ejs");
});
let waiting = undefined;
const socketGameMap = new Map();
io.on('connection', (socket) => {
    socket.on('game.create', (username) => {
        if (waiting == undefined) {
            waiting = new player_1.Player(username, socket);
            socket.emit('game.waiting');
            return;
        }
        const player = new player_1.Player(username, socket);
        const game = new game_1.Game(player, waiting);
        socketGameMap.set(player.socket.id, game);
        socketGameMap.set(waiting.socket.id, game);
        waiting = undefined;
    });
    socket.on('game.send_turn', (data) => {
        let { x, y } = data;
        let game = socketGameMap.get(socket.id);
        if (game) {
            game.applyTurn({ x, y }, socket);
        }
    });
    socket.on('peer.connected', (peerId) => {
        const game = socketGameMap.get(socket.id);
        if (game) {
            game.setPeerId(socket, peerId);
            socket.to(game.roomId).broadcast.emit('peer.connected', peerId);
        }
        else if ((waiting === null || waiting === void 0 ? void 0 : waiting.socket.id) == socket.id) {
            waiting.peerId = peerId;
        }
        else {
            console.error('whtf?');
        }
    });
    socket.on('disconnect', () => {
        if (waiting && waiting.socket.id == socket.id) {
            waiting = undefined;
            return;
        }
        let game = socketGameMap.get(socket.id);
        if (game == undefined) {
            return;
        }
        game.disconnect(socket);
        let opponentId = game.next.socket.id;
        socketGameMap.delete(socket.id);
        socketGameMap.delete(opponentId);
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { });
