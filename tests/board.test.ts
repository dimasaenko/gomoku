import { Board, InvalidCellError } from '../server/classes/board';
import { Cell } from '../server/classes/cell';
import { expect, assert } from 'chai';
import 'mocha';
import { PlayerMarker } from '../server/classes/player-marker';


describe('Check board size', 
  () => {
    it(`Board size should be ${Board.SIZE} x ${Board.SIZE} and filled with empty cells`, () => { 
      const board = new Board();
      expect(board.data.length).to.equal(Board.SIZE);
      let counter = 0;
      for (let row of board.data) {
          expect(row.length).to.equal(Board.SIZE);
          expect(row.every(c => c == PlayerMarker.empty)).to.equal(true);
          counter += Board.SIZE;
      }
      expect(counter).to.equal(Board.SIZE ** 2)
  }); 
});

describe('Cell set/get test', 
  () => {
    const board = new Board();
    
    it(`Set marker on board and get it back`, () => { 
      board.set(new Cell(7, 12, PlayerMarker.X));
      board.set(new Cell(Board.SIZE-1, Board.SIZE-1, PlayerMarker.O));
      board.set(new Cell(0, 0, PlayerMarker.X));

      expect(board.getMarker(new Cell(7, 12))).to.equal(PlayerMarker.X);
      expect(board.getMarker(new Cell(0, 0))).to.equal(PlayerMarker.X);
      expect(board.getMarker(new Cell(Board.SIZE-1, Board.SIZE-1))).to.equal(PlayerMarker.O);
    })

    it(`Set marker on Wrong Cells`, () => { 
        assert.throws(
            () => board.getMarker(new Cell(7, Board.SIZE, PlayerMarker.X)),
             InvalidCellError
        );

        assert.throws(
            () => board.set(new Cell(-1, Board.SIZE-1, PlayerMarker.X)),
             InvalidCellError
        );
    })

});
