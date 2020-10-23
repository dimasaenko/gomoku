import { WinnerType, WinnerResult }from '../server/classes/rules'
import { Cell } from '../server/classes/cell';
import { expect, assert } from 'chai';
import 'mocha';
import { PlayerMarker } from '../server/classes/player-marker';
import {MovesGenerator, GameEmulation} from './arena'
import { Board } from '../server/classes/board';


describe('Check diagonal winner', 
  () => {
    it("Scenario #1", () => { 
        let moveGen = new MovesGenerator(
            new Cell(0, 0, PlayerMarker.X),
            new Cell(0, 1, PlayerMarker.O),
            (c: Cell) => new Cell(c.x+1, c.y+1, c.marker),
            (c: Cell) => new Cell(c.x+1, c.y+1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.X, 
            WinnerType.Diagoanal,
            new Cell(0, 0, PlayerMarker.X),
            new Cell(4, 4, PlayerMarker.X)
        );

        expect(game.moveCounter).to.equal(9);
        assert.deepEqual(winRes, expectedWinnerResult)
    });

    it("Scenario #2", () => { 
        let lastCell = Board.SIZE-1;

        let moveGen = new MovesGenerator(
            new Cell(0, 0, PlayerMarker.X),
            new Cell(lastCell, lastCell, PlayerMarker.O),
            (c: Cell) => new Cell(c.x+1, c.y+2, c.marker),
            (c: Cell) => new Cell(c.x-1, c.y-1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.O, 
            WinnerType.Diagoanal,
            new Cell(lastCell-4, lastCell-4, PlayerMarker.O),
            new Cell(lastCell, lastCell, PlayerMarker.O)
        );

        expect(game.moveCounter).to.equal(10);
        assert.deepEqual(winRes, expectedWinnerResult)
    });

    it("Scenario #3", () => { 
        let lastCell = Board.SIZE-1;

        let moveGen = new MovesGenerator(
            new Cell(0, 0, PlayerMarker.X),
            new Cell(lastCell-4, 0, PlayerMarker.O),
            (c: Cell) => new Cell(c.x+1, c.y+2, c.marker),
            (c: Cell) => new Cell(c.x+1, c.y+1, c.marker),
        )

        let game = new GameEmulation(moveGen);
        let winRes = game.run()

        let expectedWinnerResult = new WinnerResult(
            PlayerMarker.O, 
            WinnerType.Diagoanal,
            new Cell(lastCell-4, 0, PlayerMarker.O),
            new Cell(lastCell, 4, PlayerMarker.O)
        );

        expect(game.moveCounter).to.equal(10);
        assert.deepEqual(winRes, expectedWinnerResult)
    });
});