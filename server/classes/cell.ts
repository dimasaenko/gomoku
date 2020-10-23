import { PlayerMarker } from "./player-marker";

class Cell {
    public x: number;
    public y: number;
    public marker : PlayerMarker;

    constructor(x : number, y: number, marker: PlayerMarker = PlayerMarker.empty) {
        this.x = x;
        this.y = y;
        this.marker = marker;
    }

    clone() {
        return new Cell(this.x, this.y, this.marker);
    }
}

export {Cell}
