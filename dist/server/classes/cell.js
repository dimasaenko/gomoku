"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const player_marker_1 = require("./player-marker");
class Cell {
    constructor(x, y, marker = player_marker_1.PlayerMarker.empty) {
        this.x = x;
        this.y = y;
        this.marker = marker;
    }
    clone() {
        return new Cell(this.x, this.y, this.marker);
    }
}
exports.Cell = Cell;
