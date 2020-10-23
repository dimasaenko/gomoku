import { Player } from "./player";
import {PlayerMarker} from "./player-marker";
import { Cell } from "./cell";
import { Board } from "./board";
import { Socket } from "socket.io";
import { Rules } from "./rules";

export class Game {
    public current : Player;
    public next : Player;
    public board = new Board();
    public roomId : string;

    private static id_counter = 1;
    public game_over: boolean = false;

    private switchPlayers() {
        let temp = this.current
        this.current = this.next
        this.next = temp
    }

    constructor(player1 : Player, player2 : Player) {
        this.current = player1;
        this.next = player2;
        if (this.coinFlip()) {
            this.switchPlayers()
        }
        this.roomId = "room+" + Game.id_counter++;
        this.current.socket.join(this.roomId);
        this.next.socket.join(this.roomId);

        this.current.marker = PlayerMarker.X
        this.next.marker = PlayerMarker.O

        this.sendStartMsg()
    }

    public setPeerId(socket : Socket, peerId : string) {
        if (socket.id == this.current.socket.id) {
            this.current.peerId = peerId;
        } else if (socket.id == this.next.socket.id) {
            this.next.peerId = peerId;
        } else {
            return;
        }
    }


    public disconnect(socket: Socket) {
        socket.to(this.roomId).broadcast.emit('game.disconnected')
    }

    public sendStartMsg()
    {
        this.current.socket.emit("game.started", {
            'marker' : '1',
            'opponent' : this.next.username
        })

        this.next.socket.emit("game.started", {
            'marker' : '-1',
            'opponent' : this.current.username
        })
    }

    public applyTurn(msg : {x: number, y: number}, socket : Socket,) {
        if (this.game_over) {
            socket.emit('game.wrong_turn', "Game over")
        }
        
        if (this.current.socket.id == socket.id) { 
            let cell = new Cell(msg.x, msg.y, this.current.marker);
            if (this.board.isValidCell(cell)) {
                this.board.set(cell);
                this.switchPlayers()
                this.broadCastLastTurn(cell);
            } else {
                socket.emit('game.wrong_turn', 'Invalid Cell')
            }
        } else {
            socket.emit('game.wrong_turn', 'Not your Turn')
        }
    }

    private broadCastLastTurn(cell: Cell) {
        let winnerRes = Rules.checkWinner(this.board, cell);
        
        let msg = {
            last_turn: cell,
            game_over : winnerRes.isFinished(),
            winner_line : {}
        }
        if (msg.game_over) {
            this.game_over = true;
            let winner_line = {
                type: winnerRes.winnerType,
                start_cell: {x: winnerRes.cellStart!.x, y: winnerRes.cellStart!.y},
                end_cell: {x: winnerRes.cellEnd!.x, y : winnerRes.cellEnd!.y}
            }
            msg.winner_line = winner_line;
        }
    
        this.next.socket.to(this.roomId).emit('game.turn_made', msg)
        this.next.socket.emit('game.turn_made', msg)
    }
    
    /**
     * Generates 0.5 probablity
     */
    private coinFlip() {
        return Math.random() >= 0.5;
    }
}
