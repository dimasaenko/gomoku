"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEmulation = exports.MovesGenerator = void 0;
const board_1 = require("../server/classes/board");
const rules_1 = require("../server/classes/rules");
class GameEmulation {
    constructor(moveGen) {
        this.moveGen = moveGen;
        this.isFinished = false;
        this.board = new board_1.Board();
        this.moveCounter = 0;
    }
    run() {
        let gen = this.moveGen.getGen();
        for (let cell of gen) {
            this.board.set(cell);
            this.moveCounter++;
            let winRes = rules_1.Rules.checkWinner(this.board, cell);
            if (winRes.isFinished()) {
                return winRes;
            }
        }
        return new rules_1.WinnerResult;
    }
}
exports.GameEmulation = GameEmulation;
class MovesGenerator {
    constructor(xStart, oStart, movementX, movementO) {
        this.xStart = xStart;
        this.oStart = oStart;
        this.movementX = movementX;
        this.movementO = movementO;
    }
    *getGen(count = 5) {
        yield this.xStart;
        yield this.oStart;
        for (let i = 0; i < count - 1; i++) {
            this.xStart = this.movementX(this.xStart);
            yield this.xStart;
            this.oStart = this.movementO(this.oStart);
            yield this.oStart;
        }
    }
}
exports.MovesGenerator = MovesGenerator;
