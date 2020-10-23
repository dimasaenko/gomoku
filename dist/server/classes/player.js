"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const player_marker_1 = require("./player-marker");
class Player {
    constructor(username, socket) {
        this.peerId = "";
        this.username = username;
        this.socket = socket;
        this.marker = player_marker_1.PlayerMarker.empty;
        this.turn = false;
        this.opponentName = "";
    }
}
exports.Player = Player;
