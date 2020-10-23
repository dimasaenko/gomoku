import { WinnerType, WinnerResult }from '../server/classes/rules'
import { Cell } from '../server/classes/cell';
import { expect, assert } from 'chai';
import 'mocha';
import { PlayerMarker } from '../server/classes/player-marker';
import {MovesGenerator, GameEmulation} from './arena'
import { Board } from '../server/classes/board';


describe('Check counter diagonal winner', 
  () => {
    it("Scenario #1", () => { 
        let lastCell = Board.SIZE - 1;

        let moveGen = new MovesGenerator(
            new Cell(lastCell, 0, PlayerMarker.X),
            new Cell(0, 1, PlayerMarker.O),
            (c: Cell) => new Cell(c.x-1, c.y+1, c.marker),
            (c: Cell) => new Cell(c.x+1, c.y+1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.X, 
            WinnerType.Counterdiagonal,
            new Cell(lastCell, 0, PlayerMarker.X),
            new Cell(lastCell-4, 4, PlayerMarker.X)
        );
        
        expect(game.moveCounter).to.equal(9);
        assert.deepEqual(winRes, expectedWinnerResult)
    });

    it("Scenario #2", () => { 
        let lastCell = Board.SIZE - 1;

        let moveGen = new MovesGenerator(
            new Cell(lastCell-4, 4, PlayerMarker.X),
            new Cell(0, 1, PlayerMarker.O),
            (c: Cell) => new Cell(c.x+1, c.y-1, c.marker),
            (c: Cell) => new Cell(c.x+1, c.y+1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.X, 
            WinnerType.Counterdiagonal,
            new Cell(lastCell, 0, PlayerMarker.X),
            new Cell(lastCell-4, 4, PlayerMarker.X)
        );
        
        expect(game.moveCounter).to.equal(9);
        assert.deepEqual(winRes, expectedWinnerResult)
    });

    it("Scenario #3", () => { 
        let lastCell = Board.SIZE - 1;

        let moveGen = new MovesGenerator(
            new Cell(lastCell, 0, PlayerMarker.X),
            new Cell(0, lastCell, PlayerMarker.O),
            (c: Cell) => new Cell(c.x-1, c.y+2, c.marker),
            (c: Cell) => new Cell(c.x+1, c.y-1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.O, 
            WinnerType.Counterdiagonal,
            new Cell(4, lastCell-4, PlayerMarker.O),
            new Cell(0, lastCell, PlayerMarker.O)
        );
        
        expect(game.moveCounter).to.equal(10);
        assert.deepEqual(winRes, expectedWinnerResult)
    });

    it("Scenario #4", () => { 
        let lastCell = Board.SIZE - 1;

        let moveGen = new MovesGenerator(
            new Cell(lastCell, 0, PlayerMarker.X),
            new Cell(4, lastCell-4, PlayerMarker.O),
            (c: Cell) => new Cell(c.x-1, c.y+2, c.marker),
            (c: Cell) => new Cell(c.x-1, c.y+1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.O, 
            WinnerType.Counterdiagonal,
            new Cell(4, lastCell-4, PlayerMarker.O),
            new Cell(0, lastCell, PlayerMarker.O)
        );
        
        expect(game.moveCounter).to.equal(10);
        assert.deepEqual(winRes, expectedWinnerResult)
    });
});