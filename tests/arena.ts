import { Cell } from '../server/classes/cell';
import { Board } from '../server/classes/board';
import { Rules, WinnerResult } from '../server/classes/rules';


class GameEmulation
{
    public isFinished : boolean = false;
    public board = new Board();
    public moveCounter = 0;

    constructor(public moveGen : MovesGenerator) {}

    public run() {
        let gen = this.moveGen.getGen()

        for (let cell of gen) {
            this.board.set(cell)
            this.moveCounter++
            let winRes = Rules.checkWinner(this.board, cell)
            if (winRes.isFinished()) {
                return winRes;
            }
        }
        return new WinnerResult;
    }
}

class MovesGenerator {
    constructor(
        public xStart: Cell, 
        public oStart: Cell, 
        public movementX : (c: Cell) => Cell, 
        public movementO : (c: Cell) => Cell, 
    ) {}

    *getGen(count = 5) : IterableIterator<Cell> {
        yield this.xStart
        yield this.oStart

        for (let i = 0; i < count - 1; i++) {
            this.xStart = this.movementX(this.xStart)
            yield this.xStart

            this.oStart = this.movementO(this.oStart)
            yield this.oStart
        }
    }
}

export {MovesGenerator, GameEmulation} 