import { PlayerMarker } from "./player-marker";
import { Cell } from "./cell";

class Board {
    public data : PlayerMarker[][];
    public static get SIZE() : number { return 19};

    constructor () {
        let n = Board.SIZE;
        this.data = new Array(n).fill(PlayerMarker.empty)
                        .map(() => new Array(n).fill(PlayerMarker.empty));
    }

    public set(cell : Cell) {
        this.checkCell(cell)
        if (this.data[cell.y][cell.x] == 0) {
            this.data[cell.y][cell.x] = cell.marker;
            return true;
        }
        return false;
    }

    public getMarker(cell : Cell) {
        this.checkCell(cell)
        return this.data[cell.y][cell.x];
    }

    public isValidCell(cell : Cell) {
        return !(cell.x >= Board.SIZE || cell.y >= Board.SIZE || cell.x < 0 || cell.y < 0)
    }

    public checkCell(cell : Cell) {
        if (!this.isValidCell(cell)) {
            throw new InvalidCellError("Invalid Cell Coordinates");
        }
    }
}

class InvalidCellError extends Error {
} 

export {Board, InvalidCellError}