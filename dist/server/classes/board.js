"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCellError = exports.Board = void 0;
const player_marker_1 = require("./player-marker");
class Board {
    constructor() {
        let n = Board.SIZE;
        this.data = new Array(n).fill(player_marker_1.PlayerMarker.empty)
            .map(() => new Array(n).fill(player_marker_1.PlayerMarker.empty));
    }
    static get SIZE() { return 19; }
    ;
    set(cell) {
        this.checkCell(cell);
        if (this.data[cell.y][cell.x] == 0) {
            this.data[cell.y][cell.x] = cell.marker;
            return true;
        }
        return false;
    }
    getMarker(cell) {
        this.checkCell(cell);
        return this.data[cell.y][cell.x];
    }
    isValidCell(cell) {
        return !(cell.x >= Board.SIZE || cell.y >= Board.SIZE || cell.x < 0 || cell.y < 0);
    }
    checkCell(cell) {
        if (!this.isValidCell(cell)) {
            throw new InvalidCellError("Invalid Cell Coordinates");
        }
    }
}
exports.Board = Board;
class InvalidCellError extends Error {
}
exports.InvalidCellError = InvalidCellError;
