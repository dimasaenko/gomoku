"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinnerResult = exports.WinnerType = exports.Rules = void 0;
const player_marker_1 = require("./player-marker");
const cell_1 = require("./cell");
var Rules;
(function (Rules) {
    Rules.WINNER_ROW = 5;
    function checkWinner(board, lastTurn) {
        let winnRes = checkHorizontalWinner(board, lastTurn);
        if (winnRes.isFinished()) {
            return winnRes;
        }
        winnRes = checkVerticalWinner(board, lastTurn);
        if (winnRes.isFinished()) {
            return winnRes;
        }
        winnRes = checkDiagonalWinner(board, lastTurn);
        if (winnRes.isFinished()) {
            return winnRes;
        }
        winnRes = checkCounterDiagonalWinner(board, lastTurn);
        return winnRes;
    }
    Rules.checkWinner = checkWinner;
    function checkHorizontalWinner(board, lastTurn) {
        let walkLeft = (cell) => { return new cell_1.Cell(cell.x - 1, cell.y, cell.marker); };
        let leftCounter = walk(lastTurn, board, walkLeft);
        let walkRight = (cell) => { return new cell_1.Cell(cell.x + 1, cell.y, cell.marker); };
        let rightCounter = walk(lastTurn, board, walkRight);
        let winnerResult = new WinnerResult();
        if (leftCounter + rightCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Horizontal;
        winnerResult.cellStart = new cell_1.Cell(lastTurn.x - leftCounter, lastTurn.y, lastTurn.marker);
        winnerResult.cellEnd = new cell_1.Cell(lastTurn.x + rightCounter, lastTurn.y, lastTurn.marker);
        return winnerResult;
    }
    function checkVerticalWinner(board, lastTurn) {
        let walkUp = (cell) => new cell_1.Cell(cell.x, cell.y - 1, cell.marker);
        let upCounter = walk(lastTurn, board, walkUp);
        let walkDown = (cell) => new cell_1.Cell(cell.x, cell.y + 1, cell.marker);
        let downCounter = walk(lastTurn, board, walkDown);
        let winnerResult = new WinnerResult();
        if (upCounter + downCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Vertical;
        winnerResult.cellStart = new cell_1.Cell(lastTurn.x, lastTurn.y - upCounter, lastTurn.marker);
        winnerResult.cellEnd = new cell_1.Cell(lastTurn.x, lastTurn.y + downCounter, lastTurn.marker);
        return winnerResult;
    }
    function checkDiagonalWinner(board, lastTurn) {
        let walkUpLeft = (cell) => new cell_1.Cell(cell.x - 1, cell.y - 1, cell.marker);
        let upLeftCounter = walk(lastTurn, board, walkUpLeft);
        let walkDownRight = (cell) => new cell_1.Cell(cell.x + 1, cell.y + 1, cell.marker);
        let downRightCounter = walk(lastTurn, board, walkDownRight);
        let winnerResult = new WinnerResult();
        if (upLeftCounter + downRightCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Diagoanal;
        winnerResult.cellStart = new cell_1.Cell(lastTurn.x - upLeftCounter, lastTurn.y - upLeftCounter, lastTurn.marker);
        winnerResult.cellEnd = new cell_1.Cell(lastTurn.x + downRightCounter, lastTurn.y + downRightCounter, lastTurn.marker);
        return winnerResult;
    }
    function checkCounterDiagonalWinner(board, lastTurn) {
        let walkDownLeft = (cell) => new cell_1.Cell(cell.x - 1, cell.y + 1, cell.marker);
        let downLeftCounter = walk(lastTurn, board, walkDownLeft);
        let walkUpRight = (cell) => new cell_1.Cell(cell.x + 1, cell.y - 1, cell.marker);
        let upRightCounter = walk(lastTurn, board, walkUpRight);
        let winnerResult = new WinnerResult();
        if (upRightCounter + downLeftCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Counterdiagonal;
        winnerResult.cellStart = new cell_1.Cell(lastTurn.x + upRightCounter, lastTurn.y - upRightCounter, lastTurn.marker);
        winnerResult.cellEnd = new cell_1.Cell(lastTurn.x - downLeftCounter, lastTurn.y + downLeftCounter, lastTurn.marker);
        return winnerResult;
    }
    function walk(cell, board, cellModifier) {
        let counter = 0;
        let nextCell = cellModifier(cell);
        while (true) {
            if (!board.isValidCell(nextCell)) {
                return counter;
            }
            if (board.getMarker(nextCell) != cell.marker) {
                return counter;
            }
            counter++;
            nextCell = cellModifier(nextCell);
        }
    }
})(Rules = exports.Rules || (exports.Rules = {}));
/**
 *
 */
var WinnerType;
(function (WinnerType) {
    WinnerType[WinnerType["None"] = 0] = "None";
    WinnerType[WinnerType["Horizontal"] = 1] = "Horizontal";
    WinnerType[WinnerType["Vertical"] = 2] = "Vertical";
    WinnerType[WinnerType["Diagoanal"] = 3] = "Diagoanal";
    WinnerType[WinnerType["Counterdiagonal"] = 4] = "Counterdiagonal"; // From left bottom to top right
})(WinnerType = exports.WinnerType || (exports.WinnerType = {}));
/**
 *
 */
class WinnerResult {
    constructor(winnerMarker = player_marker_1.PlayerMarker.empty, winnerType = WinnerType.None, cellStart = undefined, cellEnd = undefined) {
        this.winnerMarker = winnerMarker;
        this.winnerType = winnerType;
        this.cellStart = cellStart;
        this.cellEnd = cellEnd;
    }
    isFinished() {
        return this.winnerType != WinnerType.None;
    }
}
exports.WinnerResult = WinnerResult;
