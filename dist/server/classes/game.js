"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const player_marker_1 = require("./player-marker");
const cell_1 = require("./cell");
const board_1 = require("./board");
const rules_1 = require("./rules");
class Game {
    constructor(player1, player2) {
        this.board = new board_1.Board();
        this.game_over = false;
        this.current = player1;
        this.next = player2;
        if (this.coinFlip()) {
            this.switchPlayers();
        }
        this.roomId = "room+" + Game.id_counter++;
        this.current.socket.join(this.roomId);
        this.next.socket.join(this.roomId);
        this.current.marker = player_marker_1.PlayerMarker.X;
        this.next.marker = player_marker_1.PlayerMarker.O;
        this.sendStartMsg();
    }
    switchPlayers() {
        let temp = this.current;
        this.current = this.next;
        this.next = temp;
    }
    setPeerId(socket, peerId) {
        if (socket.id == this.current.socket.id) {
            this.current.peerId = peerId;
        }
        else if (socket.id == this.next.socket.id) {
            this.next.peerId = peerId;
        }
        else {
            return;
        }
    }
    disconnect(socket) {
        socket.to(this.roomId).broadcast.emit('game.disconnected');
    }
    sendStartMsg() {
        this.current.socket.emit("game.started", {
            'marker': '1',
            'opponent': this.next.username
        });
        this.next.socket.emit("game.started", {
            'marker': '-1',
            'opponent': this.current.username
        });
    }
    applyTurn(msg, socket) {
        if (this.game_over) {
            socket.emit('game.wrong_turn', "Game over");
        }
        if (this.current.socket.id == socket.id) {
            let cell = new cell_1.Cell(msg.x, msg.y, this.current.marker);
            if (this.board.isValidCell(cell)) {
                this.board.set(cell);
                this.switchPlayers();
                this.broadCastLastTurn(cell);
            }
            else {
                socket.emit('game.wrong_turn', 'Invalid Cell');
            }
        }
        else {
            socket.emit('game.wrong_turn', 'Not your Turn');
        }
    }
    broadCastLastTurn(cell) {
        let winnerRes = rules_1.Rules.checkWinner(this.board, cell);
        let msg = {
            last_turn: cell,
            game_over: winnerRes.isFinished(),
            winner_line: {}
        };
        if (msg.game_over) {
            this.game_over = true;
            let winner_line = {
                type: winnerRes.winnerType,
                start_cell: { x: winnerRes.cellStart.x, y: winnerRes.cellStart.y },
                end_cell: { x: winnerRes.cellEnd.x, y: winnerRes.cellEnd.y }
            };
            msg.winner_line = winner_line;
        }
        this.next.socket.to(this.roomId).emit('game.turn_made', msg);
        this.next.socket.emit('game.turn_made', msg);
    }
    /**
     * Generates 0.5 probablity
     */
    coinFlip() {
        return Math.random() >= 0.5;
    }
}
exports.Game = Game;
Game.id_counter = 1;
