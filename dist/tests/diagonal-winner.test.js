"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rules_1 = require("../server/classes/rules");
const cell_1 = require("../server/classes/cell");
const chai_1 = require("chai");
require("mocha");
const player_marker_1 = require("../server/classes/player-marker");
const arena_1 = require("./arena");
const board_1 = require("../server/classes/board");
describe('Check diagonal winner', () => {
    it("Scenario #1", () => {
        let moveGen = new arena_1.MovesGenerator(new cell_1.Cell(0, 0, player_marker_1.PlayerMarker.X), new cell_1.Cell(0, 1, player_marker_1.PlayerMarker.O), (c) => new cell_1.Cell(c.x + 1, c.y + 1, c.marker), (c) => new cell_1.Cell(c.x + 1, c.y + 1, c.marker));
        let game = new arena_1.GameEmulation(moveGen);
        let winRes = game.run();
        let expectedWinnerResult = new rules_1.WinnerResult(player_marker_1.PlayerMarker.X, rules_1.WinnerType.Diagoanal, new cell_1.Cell(0, 0, player_marker_1.PlayerMarker.X), new cell_1.Cell(4, 4, player_marker_1.PlayerMarker.X));
        chai_1.expect(game.moveCounter).to.equal(9);
        chai_1.assert.deepEqual(winRes, expectedWinnerResult);
    });
    it("Scenario #2", () => {
        let lastCell = board_1.Board.SIZE - 1;
        let moveGen = new arena_1.MovesGenerator(new cell_1.Cell(0, 0, player_marker_1.PlayerMarker.X), new cell_1.Cell(lastCell, lastCell, player_marker_1.PlayerMarker.O), (c) => new cell_1.Cell(c.x + 1, c.y + 2, c.marker), (c) => new cell_1.Cell(c.x - 1, c.y - 1, c.marker));
        let game = new arena_1.GameEmulation(moveGen);
        let winRes = game.run();
        let expectedWinnerResult = new rules_1.WinnerResult(player_marker_1.PlayerMarker.O, rules_1.WinnerType.Diagoanal, new cell_1.Cell(lastCell - 4, lastCell - 4, player_marker_1.PlayerMarker.O), new cell_1.Cell(lastCell, lastCell, player_marker_1.PlayerMarker.O));
        chai_1.expect(game.moveCounter).to.equal(10);
        chai_1.assert.deepEqual(winRes, expectedWinnerResult);
    });
    it("Scenario #3", () => {
        let lastCell = board_1.Board.SIZE - 1;
        let moveGen = new arena_1.MovesGenerator(new cell_1.Cell(0, 0, player_marker_1.PlayerMarker.X), new cell_1.Cell(lastCell - 4, 0, player_marker_1.PlayerMarker.O), (c) => new cell_1.Cell(c.x + 1, c.y + 2, c.marker), (c) => new cell_1.Cell(c.x + 1, c.y + 1, c.marker));
        let game = new arena_1.GameEmulation(moveGen);
        let winRes = game.run();
        let expectedWinnerResult = new rules_1.WinnerResult(player_marker_1.PlayerMarker.O, rules_1.WinnerType.Diagoanal, new cell_1.Cell(lastCell - 4, 0, player_marker_1.PlayerMarker.O), new cell_1.Cell(lastCell, 4, player_marker_1.PlayerMarker.O));
        chai_1.expect(game.moveCounter).to.equal(10);
        chai_1.assert.deepEqual(winRes, expectedWinnerResult);
    });
});
