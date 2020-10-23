"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("../server/classes/board");
const cell_1 = require("../server/classes/cell");
const chai_1 = require("chai");
require("mocha");
const player_marker_1 = require("../server/classes/player-marker");
describe('Check board size', () => {
    it(`Board size should be ${board_1.Board.SIZE} x ${board_1.Board.SIZE} and filled with empty cells`, () => {
        const board = new board_1.Board();
        chai_1.expect(board.data.length).to.equal(board_1.Board.SIZE);
        let counter = 0;
        for (let row of board.data) {
            chai_1.expect(row.length).to.equal(board_1.Board.SIZE);
            chai_1.expect(row.every(c => c == player_marker_1.PlayerMarker.empty)).to.equal(true);
            counter += board_1.Board.SIZE;
        }
        chai_1.expect(counter).to.equal(Math.pow(board_1.Board.SIZE, 2));
    });
});
describe('Cell set/get test', () => {
    const board = new board_1.Board();
    it(`Set marker on board and get it back`, () => {
        board.set(new cell_1.Cell(7, 12, player_marker_1.PlayerMarker.X));
        board.set(new cell_1.Cell(board_1.Board.SIZE - 1, board_1.Board.SIZE - 1, player_marker_1.PlayerMarker.O));
        board.set(new cell_1.Cell(0, 0, player_marker_1.PlayerMarker.X));
        chai_1.expect(board.getMarker(new cell_1.Cell(7, 12))).to.equal(player_marker_1.PlayerMarker.X);
        chai_1.expect(board.getMarker(new cell_1.Cell(0, 0))).to.equal(player_marker_1.PlayerMarker.X);
        chai_1.expect(board.getMarker(new cell_1.Cell(board_1.Board.SIZE - 1, board_1.Board.SIZE - 1))).to.equal(player_marker_1.PlayerMarker.O);
    });
    it(`Set marker on Wrong Cells`, () => {
        chai_1.assert.throws(() => board.getMarker(new cell_1.Cell(7, board_1.Board.SIZE, player_marker_1.PlayerMarker.X)), board_1.InvalidCellError);
        chai_1.assert.throws(() => board.set(new cell_1.Cell(-1, board_1.Board.SIZE - 1, player_marker_1.PlayerMarker.X)), board_1.InvalidCellError);
    });
});
