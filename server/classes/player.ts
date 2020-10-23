import { Socket } from "socket.io";
import {PlayerMarker} from "./player-marker"

class Player {
    public username : String
    public socket : Socket
    public marker: PlayerMarker;
    public turn: boolean;
    public opponentName: string;
    public peerId: string = "";

    constructor(username: String, socket: Socket) {
        this.username = username;
        this.socket = socket
        this.marker = PlayerMarker.empty;
        this.turn = false;
        this.opponentName = "";
    }
}

export {Player}