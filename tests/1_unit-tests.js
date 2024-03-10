const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const {
  puzzlesAndSolutions,
  invalidStrings,
  wrongLengthStrings,
} = require('../controllers/puzzle-strings');

let solver = new Solver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    for (let i in puzzlesAndSolutions) {
      assert.isTrue(solver.validate(puzzlesAndSolutions[i][0]));
    }
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',
    () => {
      for (let i in invalidStrings) {
        assert.equal(
          solver.validate(invalidStrings[i]),
          'Invalid characters in puzzle',
        );
      }
    });

  test('Logic handles a puzzle string that is not 81 characters in length',
    () => {
      for (let i in wrongLengthStrings) {
        assert.equal(
          solver.validate(wrongLengthStrings[i]),
          'Expected puzzle to be 81 characters long',
        );
      }
    });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(
      solver.checkRowPlacement(solver.getPuzzleArray(puzzlesAndSolutions[0][0]),
        0, 1, '3')
    );
    assert.isTrue(
      solver.checkRowPlacement(solver.getPuzzleArray(puzzlesAndSolutions[1][0]),
        0, 2, '8')
    );
    assert.isTrue(
      solver.checkRowPlacement(solver.getPuzzleArray(puzzlesAndSolutions[2][0]),
        0, 3, '1')
    );
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(
      solver.checkRowPlacement(solver.getPuzzleArray(puzzlesAndSolutions[0][0]),
        0, '4')
    );
    assert.isFalse(
      solver.checkRowPlacement(solver.getPuzzleArray(puzzlesAndSolutions[1][0]),
        0, '9')
    );
    assert.isFalse(
      solver.checkRowPlacement(solver.getPuzzleArray(puzzlesAndSolutions[2][0]),
        0, '5')
    );
  });

  test('Login handles a valid column placement', () => {
    assert.isTrue(
      solver.checkColPlacement(solver.getPuzzleArray(puzzlesAndSolutions[0][0]),
        0, '9')
    );
    assert.isTrue(
      solver.checkColPlacement(solver.getPuzzleArray(puzzlesAndSolutions[1][0]),
        0, '1')
    );
    assert.isTrue(
      solver.checkColPlacement(solver.getPuzzleArray(puzzlesAndSolutions[2][0]),
        0, '3')
    );
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(
      solver.checkColPlacement(solver.getPuzzleArray(puzzlesAndSolutions[0][0]),
        0, '3')
    );
    assert.isFalse(
      solver.checkColPlacement(solver.getPuzzleArray(puzzlesAndSolutions[1][0]),
        0, '8')
    );
    assert.isFalse(
      solver.checkColPlacement(solver.getPuzzleArray(puzzlesAndSolutions[2][0]),
        0, '4')
    );
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(
      solver.checkRegionPlacement(solver.getPuzzleArray(puzzlesAndSolutions[0][0]), 0, 0, '4')
    );
    assert.isTrue(
      solver.checkRegionPlacement(solver.getPuzzleArray(puzzlesAndSolutions[1][0]), 0, 0, '1')
    );
    assert.isTrue(
      solver.checkRegionPlacement(solver.getPuzzleArray(puzzlesAndSolutions[2][0]), 0, 0, '3')
    );
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(
      solver.checkRegionPlacement(solver.getPuzzleArray(puzzlesAndSolutions[0][0]), 0, 0, '2')
    );
    assert.isFalse(
      solver.checkRegionPlacement(solver.getPuzzleArray(puzzlesAndSolutions[1][0]), 0, 0, '3')
    );
    assert.isFalse(
      solver.checkRegionPlacement(solver.getPuzzleArray(puzzlesAndSolutions[2][0]), 0, 0, '5')
    );
  });

  test('Valid puzzle strings pass the solver', () => {
    for (let i in puzzlesAndSolutions) {
      assert.equal(
        solver.solve(puzzlesAndSolutions[i][0]),
        puzzlesAndSolutions[i][1],
      );
    }
  });

  test('Invalid puzzle strings fail the solver', () => {
    for (let i in invalidStrings) {
      try {
        solver.solve(invalidStrings[i]);
      } catch (e) {
        assert.equal(
          e.message,
          'Invalid characters in puzzle',
        );
      }
    }
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    for (let i in puzzlesAndSolutions) {
      assert.equal(
        solver.solve(puzzlesAndSolutions[i][0]),
        puzzlesAndSolutions[i][1],
      );
    }
  });
});
