import { PlayerMarker } from "./player-marker"
import { Board } from "./board";
import { Cell } from "./cell";


export namespace Rules {
    export const WINNER_ROW = 5;

    export function checkWinner(board : Board, lastTurn : Cell) : WinnerResult {
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

    function checkHorizontalWinner (board : Board, lastTurn : Cell) : WinnerResult{
        let walkLeft = (cell : Cell) => {return new Cell(cell.x - 1, cell.y, cell.marker)}
        let leftCounter = walk(lastTurn, board, walkLeft);
    
        let walkRight = (cell : Cell) => {return new Cell(cell.x + 1, cell.y, cell.marker)}
        let rightCounter = walk(lastTurn, board, walkRight);
        
        let winnerResult = new WinnerResult();
        if (leftCounter + rightCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
    
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Horizontal;
        winnerResult.cellStart = new Cell(lastTurn.x - leftCounter, lastTurn.y, lastTurn.marker)
        winnerResult.cellEnd = new Cell(lastTurn.x + rightCounter, lastTurn.y, lastTurn.marker)
        return winnerResult;
    }

    function checkVerticalWinner (board : Board, lastTurn : Cell) : WinnerResult{
        let walkUp = (cell : Cell) => new Cell(cell.x, cell.y-1, cell.marker)
        let upCounter = walk(lastTurn, board, walkUp);
    
        let walkDown = (cell : Cell) => new Cell(cell.x, cell.y+1, cell.marker)
        let downCounter = walk(lastTurn, board, walkDown);
        
        let winnerResult = new WinnerResult();
        if (upCounter + downCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
    
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Vertical;
        winnerResult.cellStart = new Cell(lastTurn.x, lastTurn.y - upCounter, lastTurn.marker)
        winnerResult.cellEnd = new Cell(lastTurn.x, lastTurn.y + downCounter, lastTurn.marker)
        return winnerResult;
    }

    function checkDiagonalWinner (board : Board, lastTurn : Cell) : WinnerResult {
        let walkUpLeft = (cell : Cell) => new Cell(cell.x-1, cell.y-1, cell.marker)
        let upLeftCounter = walk(lastTurn, board, walkUpLeft);
    
        let walkDownRight = (cell : Cell) => new Cell(cell.x+1, cell.y+1, cell.marker)
        let downRightCounter = walk(lastTurn, board, walkDownRight);
        
        let winnerResult = new WinnerResult();
        if (upLeftCounter + downRightCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
    
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Diagoanal;
        winnerResult.cellStart = new Cell(lastTurn.x - upLeftCounter, lastTurn.y - upLeftCounter, lastTurn.marker)
        winnerResult.cellEnd = new Cell(lastTurn.x + downRightCounter, lastTurn.y + downRightCounter, lastTurn.marker)
        return winnerResult;
    }

    function checkCounterDiagonalWinner (board : Board, lastTurn : Cell) : WinnerResult 
    {
        let walkDownLeft = (cell : Cell) => new Cell(cell.x-1, cell.y+1, cell.marker)
        let downLeftCounter = walk(lastTurn, board, walkDownLeft);

        let walkUpRight = (cell : Cell) => new Cell(cell.x+1, cell.y-1, cell.marker)
        let upRightCounter = walk(lastTurn, board, walkUpRight);
        
        let winnerResult = new WinnerResult();
        if (upRightCounter + downLeftCounter + 1 < Rules.WINNER_ROW) {
            return winnerResult;
        }
    
        winnerResult.winnerMarker = lastTurn.marker;
        winnerResult.winnerType = WinnerType.Counterdiagonal;
        winnerResult.cellStart = new Cell(lastTurn.x + upRightCounter, lastTurn.y - upRightCounter, lastTurn.marker)
        winnerResult.cellEnd = new Cell(lastTurn.x - downLeftCounter, lastTurn.y + downLeftCounter, lastTurn.marker)
        return winnerResult;
    }
    
    function walk(cell : Cell, board : Board, cellModifier : (c: Cell) => Cell) {
        let counter = 0;
        let nextCell = cellModifier(cell)
        while (true) {
            if (!board.isValidCell(nextCell)) {
                return counter;
            }
            if (board.getMarker(nextCell) != cell.marker ) {
                return counter;
            }
            counter++;
            nextCell = cellModifier(nextCell)
        }
    }
}


/**
 * 
 */
export enum WinnerType {
    None = 0,
    Horizontal = 1,
    Vertical = 2,
    Diagoanal = 3,      // From left top to bottom right
    Counterdiagonal = 4 // From left bottom to top right
}

/**
 * 
 */
export class WinnerResult {
    constructor (
        public winnerMarker = PlayerMarker.empty,
        public winnerType = WinnerType.None,
        public cellStart : Cell | undefined = undefined,
        public cellEnd : Cell | undefined = undefined,
    ){}

    public isFinished() {
        return this.winnerType != WinnerType.None;
    }
}
